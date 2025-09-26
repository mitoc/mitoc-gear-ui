// Branded types improve type safety by differenciating ID-types that have the same
// run-time type but represent different entities.
declare const __brand: unique symbol;

export type PersonID = number & { readonly [__brand]: "PersonID" };
export type GearItemID = string & { readonly [__brand]: "GearItemID" };
export type PeopleGroupID = number & { readonly [__brand]: "PeopleGroupID" };
export type ApprovalID = number & { readonly [__brand]: "ApprovalID" };
export type LocationID = number & { readonly [__brand]: "LocationID" };
export type GearTypeID = number & { readonly [__brand]: "GearTypeID" };
export type PurchasableID = number & { readonly [__brand]: "PurchasableID" };
export type SignupID = number & { readonly [__brand]: "SignupID" };
