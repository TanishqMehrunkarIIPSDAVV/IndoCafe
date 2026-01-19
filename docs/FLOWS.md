# 🌊 Core Flows & Lifecycle

## 🔄 Customer Lifecycle (Dine-In)

This is the primary flow for the "Indo Cafe" experience.

1.  **Arrival & Allocation**
    - Customer walks in.
    - **Manager/Waiter** assigns a table (temporarily reserves it).
    - _Future Goal_: Automate this via "Host" role or Self-Check-in kiosk.

2.  **The Digital Connection (QR Code)**
    - Customer sits at the table (e.g., Table 5).
    - Customer scans the QR Code on the table.
    - **Link**: `https://app.indocafe.com/:outletId/:tableId` (e.g., `/delhi-01/T5`)
    - **Frontend**: Detects `tableId` in URL -> Switches to "Dine-In Mode".
      - Delivery options hidden.
      - Table #5 displayed at top.
      - `outletId` and `tableId` stored in Session/Context.

3.  **Ordering (The "Session")**
    - Customer browses menu and adds items to cart.
    - **Checkout**:
      - No address needed.
      - Payment can be "Pay Later" (Cash/Card at counter) or "Pay Now" (Online).
    - **Submission**:
      - `POST /api/public/orders`
      - Payload includes `{ tableId: "...", items: [...] }`.

4.  **Service & Interaction**
    - **Kitchen**: Sees order for "Table 5". Prepares food.
    - **Waiter**: Delivers food. Marks order as "Delivered".
    - _Repeat_: Customer can order more items (Dessert, Drinks) within the same session.

5.  **Departure**
    - Customer requests bill.
    - Payment is processed.
    - **Manager/Waiter** marks table as "Unreserved/Free".
    - Lifecycle ends.

---

## 🏢 Operational Modes

Indo Cafe outlets can operate in three distinct modes. The system adapts based on the `Outlet` configuration.

### 1. Dine-In Only (Traditional)

- **Focus**: Tables, QR Codes, Waiters.
- **Customer Flow**: Walk-in -> Stay -> Eat -> Pay.
- **Key Interface**: `/:outletId/:tableId` (OrderSession).
- **Delivery**: Disabled or redirected to 3rd party apps.

### 2. Cloud Kitchen (Delivery Only)

- **Focus**: High volume delivery, Aggregator integration (Zomato/Swiggy).
- **Customer Flow**: Online Order -> Prep -> Dispatch.
- **Key Interface**: `/home` (or public website) for direct ordering.
- **Tables**: None (Tables API disabled).

### 3. Hybrid (Modern Restaurant)

- **Focus**: Both Dine-in and Delivery.
- **Customer Flow**:
  - _Premise_: QR Code ordering.
  - _Remote_: Web ordering.
- **Key Interface**: Both Active.

---

## 🛣️ Route Structure

### Client Routes (`App.jsx`)

| Route                 | Access         | Description                                             |
| :-------------------- | :------------- | :------------------------------------------------------ |
| `/home`               | Public         | General landing page (Delivery focus).                  |
| `/:outletId/:tableId` | Public         | **QR Code Entry Point**. Loads Home with Table Context. |
| `/login`              | Public         | Staff/Admin login.                                      |
| `/admin/*`            | Super Admin    | Global settings, User management, Analytics.            |
| `/manager/*`          | Outlet Manager | Live Orders, Staff, Menu Control, Table Layout.         |
| `/kitchen/*`          | Kitchen Staff  | KDS (Kitchen Display System).                           |
| `/waiter/*`           | Waiter         | Handheld ordering, Table status, Serve readiness.       |

### Server Routes (`server/routes`)

| Prefix                | File             | Purpose                                        |
| :-------------------- | :--------------- | :--------------------------------------------- |
| `/api/public/orders`  | `orderRoutes.js` | Customer order creation (Open endpoint).       |
| `/api/manager/orders` | `orderRoutes.js` | Staff order management (Get/Update Status).    |
| `/api/manager/tables` | `tableRoutes.js` | Layout management (Create/Delete Tables).      |
| `/api/waiter/tables`  | `tableRoutes.js` | Table operations (Reserve/Release/Get Orders). |
