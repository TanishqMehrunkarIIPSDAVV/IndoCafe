# 🍕 Role: Customer

## 👤 User Persona

**Who are they?**
The end-user dining at the restaurant. They have walked in, been seated, and want a frictionless ordering experience without waiting for a waiter.
**Key Design Requirement**: Visual appeal (Food Porn), Instant Access (QR Code), Real-time Status.

## 🔐 Access Level

- **Routes**: `/shop/*` (Delivery), `/:outletId/:tableId` (Dine-In)
- **Capabilities**: Browse Menu, Add to Cart, Checkout (Pay Now/Later), Track Order.
- **Restrictions**: Read-only mainly. Can only edit _their own_ active untransmitted orders.

## 🛠️ Key Features & Implementation Status

| Feature            | Description                                                  | Status             |
| :----------------- | :----------------------------------------------------------- | :----------------- |
| **QR Code Entry**  | Scan code -> Redirect to `/:outletId/:tableId` -> Load Menu. | ✅ **Done**        |
| **Digital Menu**   | Categorized list with high-res photos and "Add" buttons.     | ⚠️ **In Progress** |
| **Ordering**       | Add items -> "Place Order" -> Sent to Kitchen/Waiter.        | ✅ **Done**        |
| **Cart Logic**     | Session-based cart for the current table.                    | ⚠️ **In Progress** |
| **Authentication** | Guest Checkout (No login required for Dine-in).              | ✅ **Done**        |
| **Order Tracking** | Real-time status updates (Placed -> Cooking -> Serve).       | ❌ **To Do**       |

## 🔄 Daily Workflow (Dine-In)

1.  **Arrival**: Customer sits at **Table 5**.
2.  **Connection**: Scans QR Code. Phone opens `app.indocafe.com/delhi-01/T5`.
3.  **Selection**: Browses menu. Adds 2 Burgers and 1 Coke.
4.  **Submission**: Clicks "Place Order".
    - _Note_: Payment can be done now (Online) or later (CashCounter).
5.  **Anticipation**: Watches screen:
    - "Kitchen is preparing..."
6.  **Service**: Waiter brings food.
7.  **Completion**: Customer requests bill (if Pay Later) or just leaves (if Pay Now). Manager/Waiter frees the table.
