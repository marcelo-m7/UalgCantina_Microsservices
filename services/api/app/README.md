# Menu API

This project is a FastAPI-based backend API for managing restaurant menus, dishes, and allergens. It integrates with a MySQL database for data storage and uses Firebase Admin SDK for authentication for administrative operations.

## Technologies Used

*   **FastAPI:** High-performance web framework for building APIs.
*   **SQLAlchemy:** ORM (Object-Relational Mapper) for interacting with the MySQL database.
*   **MySQL:** Relational database used for storing menu, dish, and allergen data.
*   **Firebase Admin SDK:** Used for verifying user authentication tokens for protected routes.
*   **Uvicorn:** ASGI server to run the FastAPI application.
*   **python-dotenv:** For loading environment variables from a `.env` file.

## Setup and Installation

1.  **Clone the repository:**
    
```bash
git clone <repository_url>
    cd <project_directory>/project/api
```

2.  **Create a virtual environment (recommended):**
    
```bash
python -m venv venv
```

3.  **Activate the virtual environment:**
    *   On Windows:
        
```bash
venv\Scripts\activate
```
    *   On macOS and Linux:
        
```bash
source venv/bin/activate
```

4.  **Install dependencies:**
    
```bash
pip install -r requirements.txt
```

5.  **Set up environment variables:**
    *   Create a `.env` file in the `project/api` directory by copying the `.env.example` file:
        
```bash
cp .env.example .env
```
    *   Edit the `.env` file and fill in your database credentials and the path to your Firebase service account key file.

## Running the API

Navigate to the `project/api` directory in your terminal (make sure your virtual environment is active) and run the API using Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be running at `http://127.0.0.1:8000`.

## API Endpoints

The API provides the following endpoints under the `/api/v1` prefix:

*   **`/api/v1/allergens/`**:
    *   `GET`: Retrieve a list of all allergens (Public).
    *   `POST`: Create a new allergen (Authenticated - Admin/Editor).
    *   `PUT /{allergen_id}`: Update an existing allergen (Authenticated - Admin/Editor).
    *   `DELETE /{allergen_id}`: Delete an allergen (Authenticated - Admin/Editor).

*   **`/api/v1/dishes/`**:
    *   `GET`: Retrieve a list of all dishes, including their associated allergens (Public).
    *   `POST`: Create a new dish (Authenticated - Admin/Editor).
    *   `PUT /{dish_id}`: Update an existing dish (Authenticated - Admin/Editor).
    *   `DELETE /{dish_id}`: Delete a dish (Authenticated - Admin/Editor).

*   **`/api/v1/menus/`**:
    *   `/api/v1/menus/public/weekly/`:
        *   `GET`: Retrieve the current week's menu (Public).
    *   `/api/v1/menus/weekly-admin/`:
        *   `GET`: Retrieve a weekly menu for a specified date range (Authenticated - Admin/Editor).
    *   `/api/v1/menus/day/{date_str}/{meal_type}`:
        *   `PUT`: Create or update a menu entry for a specific date and meal type (Authenticated - Admin/Editor).
    *   `/api/v1/menus/entry/{entry_id}`:
        *   `DELETE`: Delete a specific menu entry by ID (Authenticated - Admin/Editor).

## Database Schema

The MySQL database includes the following tables:

*   **`users`**: Stores user information (id, name, email, role, created\_at).
*   **`allergens`**: Stores allergen details (id, name, icon, description).
*   **`dishes`**: Stores dish details (id, name, type, description, price, kcals).
*   **`dish_allergens`**: A linking table for the many-to-many relationship between `dishes` and `allergens` (dish\_id, allergen\_id).
*   **`menu_entries`**: Stores daily menu entries for lunch and dinner, linking to dishes (id, date, meal\_type, main\_dish\_id, alt\_dish\_id, dessert\_id, sopa\_id, notes).

## Authentication

The API uses Firebase Authentication to secure administrative endpoints.

1.  **Obtain a Firebase Service Account Key:**
    *   Go to the Firebase console (console.firebase.google.com).
    *   Select your project.
    *   Click on the gear icon (Project settings).
    *   Go to the 'Service accounts' tab.
    *   Click on 'Generate new private key'.
    *   Click 'Generate key' to download a JSON file containing your service account key.

2.  **Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:**
    *   In your `.env` file, set the `GOOGLE_APPLICATION_CREDENTIALS` variable to the absolute path of the downloaded JSON file. This file contains the credentials needed for the Firebase Admin SDK to verify tokens. Keep this file secure.

The API's protected routes require a valid Firebase ID token in the `Authorization: Bearer <token>` header. The `verify_token` dependency in `auth.py` validates the token and checks for the presence of a valid 'role' claim ('admin' or 'editor') and email verification. Only users with these roles and a verified email can access authenticated endpoints.