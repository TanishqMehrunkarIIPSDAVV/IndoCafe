# 🍕 Role: Customer

## 👤 User Persona

**Who are they?**
The end-user ordering food either from home (Delivery) or scanning a QR code at the table (Dine-in). They demand a slick, Amazon-like seamless experience.
**Key Design Requirement**: Visual appeal (Food Porn), Frictionless checkout, Real-time reassurance (Tracking).

## 🔐 Access Level

- **Routes**: `/shop/*`, `/account/*`
- **Capabilities**: Browse Menu, Add to Cart, Checkout, Track Order.
- **Restrictions**: Read-only mainly. Can only edit _their own_ active untransmitted orders or profile.

## 🛠️ Key Features & Implementation Status

| Feature            | Description                                                                           | Status             |
| :----------------- | :------------------------------------------------------------------------------------ | :----------------- |
| **Home Page**      | Attractive landing page. Currently contains dummy data.                               | ⚠️ **In Progress** |
| **Digital Menu**   | Categorized list with high-res photos and "Add" buttons.                              | ❌ **To Do**       |
| **Cart Logic**     | LocalStorage/Server-side cart handling.                                               | ❌ **To Do**       |
| **Authentication** | Sign up / Login (OTP based preferred for mobile).                                     | ❌ **To Do**       |
| **Checkout**       | Address selection, Payment Gateway (Stripe/Razorpay) integration.                     | ❌ **To Do**       |
| **Order Tracking** | "Uber-style" tracking map or status steps (Confirmed -> Cooking -> Out for Delivery). | ❌ **To Do**       |

## 🔄 Daily Workflow

1.  **Discovery**: User lands on the site/app. Sees "Best Sellers".
2.  **Selection**: Browses "Pizza" category. Selects "Margherita".
3.  **Customization**: Modal opens -> Choose Size (Large), Add Topping (Mushrooms). -> Add to Cart.
4.  **Checkout**: View Cart -> Proceed to Pay -> Enter Address -> Pay via UPI/Card.
5.  **Anticipation**: Watches the status screen.
    - "Kitchen is preparing your order..."
    - "Rider picked up..."
6.  **Reception**: Food arrives. User rates the food (Optional).
