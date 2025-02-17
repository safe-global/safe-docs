# Migrate to v3

This guide references the major changes between v2 and v3 to help those migrating an existing app.

## Changed method signature

We extracted `safeAddress` and renamed `xxxProps` types to `xxxOptions` types in the following method

- `getSafeOperationsByAddress(props: GetSafeOperationListProps)` is now `getSafeOperationsBySafeAddress(safeAddress, options: GetSafeOperationListOptions)`

## Renamed types

We renamed the `xxxProps` types to `xxxOptions` in the following methods:

- `addMessage(safeAddress: string, addMessageProps: AddMessageProps)` is now `addMessage(safeAddress: string, addMessageOptions: AddMessageOptions)`
- `getMessages(safeAddress: string, props: GetSafeMessageListProps)` is now `getMessages(safeAddress: string, options: GetSafeMessageListOptions)`
