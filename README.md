# Macomb City Guide

This project is a web application that provides comprehensive information about Macomb, MI. It consists of a frontend built with Next.js and a backend powered by Django. The application includes various sections such as attractions, events, food & dining, real estate, and transportation.

## Project Structure

- **frontend/**: Contains the Next.js application.
  - **public/**: Static files like images and icons.
  - **app/**: Main application components and pages.
  - **components/**: Reusable components used throughout the application.
  - **lib/**: Utility functions for API calls.
  - **styles/**: CSS and styling files.
  - **package.json**: Configuration for npm dependencies and scripts.
  - **next.config.js**: Next.js configuration settings.
  - **tailwind.config.js**: Tailwind CSS configuration.

- **backend/**: Contains the Django application.
  - **macomb_project/**: Main Django project files.
  - **api/**: Django app for handling API requests and data models.
  - **scraper/**: Contains web scraping logic to gather information about Macomb.
  - **requirements.txt**: Lists Python dependencies for the backend.
  - **manage.py**: Command-line utility for managing the Django project.

## Features

- **Home**: Overview of Macomb, including the latest news and highlights.
- **Attractions**: A list of landmarks, parks, and museums in Macomb.
- **Events**: Information on upcoming concerts, festivals, and local events.
- **Food & Dining**: Recommendations for restaurants, bars, and cafes.
- **Real Estate**: Listings for rentals and properties available in the area.
- **Transportation**: Details on public transit options, taxis, and bike rentals.

## Technology Stack

- **Frontend**:
  - Next.js 14
  - React 18
  - Tailwind CSS
  - Redux Toolkit for state management
  - NextAuth.js for authentication

- **Backend**:
  - Django
  - Django REST Framework
  - PostgreSQL (optional)
  - BeautifulSoup/Scrapy for web scraping

## Getting Started

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd macomb-city-guide/frontend
   ```

2. Install dependencies   using npm:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the front end at http://localhost:3000

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd macomb-city-guide/backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv backend-venv
   source backend-venv/bin/activate # On Windows use `backend-venv\Scripts\activate`
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Run the Django server:
   ```bash
   python manage.py runserver
   ```

6. Access the API at http://localhost:8000/api/

### Web Scraping
The backend includes a webscraping component that automatically gathers data about Macomb. you can run the scraping command using:
```
python manage.py scrape_data
```

### Deployment
#### Frontend
The Next.js frontend can be deployed to Vercel:
```
npm run build
```
#### Backend
The Django backend can be deployed to platforms like Heroku, DigitalOcean, or AWS:
```
# Example for production settings
python manage.py collectstatic
gunicorn macomb_project.wsgi
```
### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

### License
This project is licensed under the MIT License. See the LICENSE file for more details.