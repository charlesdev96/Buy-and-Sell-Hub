**Simple RESTful API Backend**

This project is a simple RESTful API designed to allow users to register, upgrade their accounts to vendor status, and sell products to make money.

**Features**

1. User Registration: Users can create an account by providing necessary details like username, password, and email.
2. Account Upgrade: Registered users can upgrade their accounts to vendor status, enabling them to sell products.
3. Product Management: Vendors can add, update, and delete products.
4. Product Search: Users can search for products by description or name.

**Getting Started**:

1. Clone the Repository: Use git clone https://github.com/charlesdev96/Buy-and-Sell-Hub to clone this repository.
2. Install Dependencies: Run npm install in the project directory to install the required dependencies.
3. Configure Database: Create a database connection using your preferred database technology (e.g., Postgres) and update the configuration details in the appropriate environment variables file.
4. Start the Server: **Run npm dev** to start the API server.

**API Endpoints**:

**NOTE**: Most API endpoints in this project require authentication. This means you'll need a token to access information about the currently logged-in user or perform actions on their behalf. Endpoints like registration and login are exempt from this requirement. If you attempt to access a protected endpoint without a valid token, you'll receive an error message prompting you to log in. For easy token management in Postman, you can leverage the "Authorization" header with the "Bearer Token" scheme. Simply copy and paste your access token, which is automatically retrieved upon successful login and stored as accessToken in your code. I've implemented a code that automatically copies the token from the login when "Bearer Token" is clicked, and I've named it "accessToken". You can do this by: in login, click on Test/Scripts and paste this code:

const jsonData = pm.response.json()

pm.globals.set("accessToken", jsonData.token)

URL = http://localhost:5000/api/v1

A. User Registration and Login:

1. Creates a new user account:(POST) URL/auth/register.
2. Resend verification code: (POST) URL/auth/resend-email/userId
3. Verify your account: (Post) URL/auth/userId/verificationCode
4. User Login: (POST) URL/auth/login
5. Forgot password: (POST) URL/auth/forgot-password
6. Reset password: (POST) URL/auth/reset-password/userId/verificationCode

B. User profile

1. Get user profile: (GET) URL/user/user-profile
2. Update user profile: (PATCH) URL/user/update-user

C. Products

1. Create product: (POST) URL/product/create-product
2. Get single product: (GET) URL/product/productId
3. Get all products: (GET) URL/product/all-products
4. Update product: (PATCH) URL/product/update-product/productId
5. Get product by category: (GET) URL/product/product-by-category?category=??
6. Search product: (GET) URL/product/search-product?search=??
7. Review product: (POST) URL/review/review-product/productId
8. Update product: (PATCH) URL/review/update-review/reviewId

D. Vendor

1. upgrade account: (POST) URL/user/upgrade-account
2. Update store: (PATCH) URL/vendor/update-store/storeId

E. Cart

1. Add item to cart: (POST) URL/cart/add-to-cart/cartId
2. Remove item from cart: (DELETE) URL/cart/remove-item/productId
3. Get user cart: (GET) URL/cart/get-cart

**NOTE**:

A sample of how i called the endpoints in postman can be seen using the link below and there is an example template for each endpoint.

Postman link: https://planetary-resonance-291958.postman.co/workspace/My-projects~3386f09f-c094-433a-9366-7d26b8037230/collection/23276713-40de875c-7b98-4871-815b-95432d391587

This will provide you with insights into how the endpoints were utilized in Postman, along with templates that you can use for reference or testing purposes.

\*\* Contributing
Contributions are welcome! If you have any ideas or improvements, please feel free to open an issue or submit a pull request.
