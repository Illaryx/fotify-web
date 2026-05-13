#!/bin/bash

set -e

STAGE=${1:-dev}

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ALLOWED_STAGES=("dev" "prod")
if [[ ! " ${ALLOWED_STAGES[@]} " =~ " ${STAGE} " ]]; then
    echo -e "${RED}Error: Stage '${STAGE}' no válido. Stages permitidos: ${ALLOWED_STAGES[*]}${NC}"
    exit 1
fi

ENV_FILE=".env.${STAGE}"
if [ ! -f "${ENV_FILE}" ]; then
    echo -e "${RED}Error: archivo ${ENV_FILE} no encontrado.${NC}"
    exit 1
fi

echo -e "${BLUE}Cargando ${ENV_FILE}...${NC}"
set -o allexport
# shellcheck source=/dev/null
source "${ENV_FILE}"
set +o allexport

# Validar variables requeridas
REQUIRED_VARS=("APP_NAME" "REGION" "AWS_PROFILE")
for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo -e "${RED}Error: variable '${VAR}' no está definida en ${ENV_FILE}${NC}"
        exit 1
    fi
done

BUCKET_NAME="${APP_NAME}-${STAGE}"
AWS_CMD="aws --profile ${AWS_PROFILE} --region ${REGION}"

echo -e "${GREEN}=== Autrek Admin — Deploy Script ===${NC}"
echo -e "${BLUE}Stage:   ${STAGE}${NC}"
echo -e "${BLUE}Bucket:  ${BUCKET_NAME}${NC}"
echo -e "${BLUE}Profile: ${AWS_PROFILE}${NC}"
echo -e "${BLUE}Region:  ${REGION}${NC}\n"

# ── 1. Build ──────────────────────────────────────────────────────────────────
echo -e "${YELLOW}[1/4] Construyendo aplicación...${NC}"
npm run build
echo -e "${GREEN}✓ Build completado — .output/public/${NC}"

# ── 2. Sync S3 ────────────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[2/4] Subiendo archivos a S3...${NC}"

# Assets con hash (_nuxt/): caché larga vida (Vite genera nombres únicos por contenido)
${AWS_CMD} s3 sync .output/public/_nuxt/ "s3://${BUCKET_NAME}/_nuxt/" \
    --cache-control "max-age=31536000, immutable"

# HTML, _payload.json y demás sin hash: sin caché para que los browsers
# siempre obtengan la versión del último deploy
${AWS_CMD} s3 sync .output/public/ "s3://${BUCKET_NAME}" \
    --delete \
    --exclude "_nuxt/*" \
    --cache-control "no-cache, no-store, must-revalidate"

echo -e "${GREEN}✓ Archivos subidos${NC}"

# ── 3. Obtener distribución CloudFront ────────────────────────────────────────
echo -e "\n${YELLOW}[3/4] Obteniendo distribución CloudFront...${NC}"

DISTRIBUTION_ID=$(${AWS_CMD} cloudfront list-distributions \
    --query "DistributionList.Items[?Origins.Items[?DomainName=='${BUCKET_NAME}.s3.${REGION}.amazonaws.com']].Id | [0]" \
    --output text 2>/dev/null || echo "")

if [ -z "${DISTRIBUTION_ID}" ] || [ "${DISTRIBUTION_ID}" = "None" ]; then
    echo -e "${RED}Error: no se encontró distribución CloudFront para el bucket '${BUCKET_NAME}'.${NC}"
    echo -e "${YELLOW}Verifica que el origin del bucket sea: ${BUCKET_NAME}.s3.${REGION}.amazonaws.com${NC}"
    exit 1
fi

CLOUDFRONT_URL=$(${AWS_CMD} cloudfront get-distribution \
    --id "${DISTRIBUTION_ID}" \
    --query 'Distribution.DomainName' \
    --output text)

echo -e "${GREEN}✓ Distribution ID: ${DISTRIBUTION_ID}${NC}"
echo -e "${GREEN}✓ CloudFront URL:  https://${CLOUDFRONT_URL}${NC}"

# ── 4. Invalidar caché ────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[4/4] Invalidando caché de CloudFront...${NC}"

INVALIDATION_ID=$(${AWS_CMD} cloudfront create-invalidation \
    --distribution-id "${DISTRIBUTION_ID}" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo -e "${GREEN}✓ Invalidación creada: ${INVALIDATION_ID}${NC}"

echo -e "\n${GREEN}=== Deploy completado ===${NC}"
echo -e "${GREEN}App disponible en: https://${CLOUDFRONT_URL}${NC}\n"
