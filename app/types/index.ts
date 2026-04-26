import type { components } from './api'

type S = components['schemas']

// Auth
export type LoginInput = S['github_com_Illaryx_fotify-api_internal_application_auth.LoginInput']
export type RegisterInput = S['github_com_Illaryx_fotify-api_internal_application_auth.RegisterInput']
export type RefreshInput = S['github_com_Illaryx_fotify-api_internal_application_auth.RefreshInput']
export type TokenPair = S['github_com_Illaryx_fotify-api_internal_application_auth.TokenPair']

// Events
export type EventResponse = S['github_com_Illaryx_fotify-api_internal_application_event.EventResponse']
export type CreateEventInput = S['github_com_Illaryx_fotify-api_internal_application_event.CreateEventInput']
export type UpdateEventInput = S['github_com_Illaryx_fotify-api_internal_application_event.UpdateEventInput']
export type EventStatus = S['github_com_Illaryx_fotify-api_internal_domain_entity.EventStatus']

// Photos
export type PhotoResponse = S['github_com_Illaryx_fotify-api_internal_application_photo.PhotoResponse']
export type InitUploadInput = S['github_com_Illaryx_fotify-api_internal_application_photo.InitUploadInput']
export type InitUploadResponse = S['github_com_Illaryx_fotify-api_internal_application_photo.InitUploadResponse']
export type ConfirmUploadInput = S['github_com_Illaryx_fotify-api_internal_application_photo.ConfirmUploadInput']
export type DownloadResponse = S['github_com_Illaryx_fotify-api_internal_application_photo.DownloadResponse']
export type PhotoStatus = S['github_com_Illaryx_fotify-api_internal_domain_entity.PhotoStatus']

// Photographers
export type PhotographerResponse = S['github_com_Illaryx_fotify-api_internal_application_photographer.PhotographerResponse']
export type CreateProfileInput = S['github_com_Illaryx_fotify-api_internal_application_photographer.CreateProfileInput']
export type UpdateProfileInput = S['github_com_Illaryx_fotify-api_internal_application_photographer.UpdateProfileInput']
export type PhotographerPlan = S['github_com_Illaryx_fotify-api_internal_domain_entity.PhotographerPlan']

// Orders
export type OrderResponse = S['github_com_Illaryx_fotify-api_internal_application_order.OrderResponse']
export type CreateOrderInput = S['github_com_Illaryx_fotify-api_internal_application_order.CreateOrderInput']
export type ConfirmPaymentInput = S['github_com_Illaryx_fotify-api_internal_application_order.ConfirmPaymentInput']
export type OrderStatus = S['github_com_Illaryx_fotify-api_internal_domain_entity.OrderStatus']
export type OrderType = S['github_com_Illaryx_fotify-api_internal_domain_entity.OrderType']

// Search
export type SearchInput = S['github_com_Illaryx_fotify-api_internal_application_search.SearchInput']
export type SearchResponse = S['github_com_Illaryx_fotify-api_internal_application_search.SearchResponse']
export type SearchResultResponse = S['github_com_Illaryx_fotify-api_internal_application_search.SearchResultResponse']
export type InitSearchResponse = S['github_com_Illaryx_fotify-api_internal_application_search.InitSearchResponse']
export type ConsentInput = S['github_com_Illaryx_fotify-api_internal_application_search.ConsentInput']
export type ExecuteSearchInput = S['github_com_Illaryx_fotify-api_internal_application_search.ExecuteSearchInput']

// Payouts
export type PayoutResponse = S['github_com_Illaryx_fotify-api_internal_application_payout.PayoutResponse']
export type CreatePayoutInput = S['github_com_Illaryx_fotify-api_internal_application_payout.CreatePayoutInput']
export type PayoutStatus = S['github_com_Illaryx_fotify-api_internal_domain_entity.PayoutStatus']

// Misc
export type BankAccount = S['github_com_Illaryx_fotify-api_internal_domain_entity.BankAccount']

// API envelope helpers
export interface ListEnvelope<T> {
  data?: {
    items?: T[]
    total?: number
    limit?: number
    offset?: number
  }
  success?: boolean
}

export interface SingleEnvelope<T> {
  data?: T
  success?: boolean
}
