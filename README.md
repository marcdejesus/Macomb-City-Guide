# Macomb City Guide

This project is a web application that provides comprehensive information about Macomb, MI. It consists of a frontend built with Next.js and a backend powered by Django. The application includes various sections such as attractions, events, food & dining, real estate, and transportation.

## Project Structure

- **frontend/**: Contains the Next.js application.
  - **public/**: Static files like images and icons.
  - **src/**: Source code for the application.
    - **app/**: Main application components and pages.
    - **components/**: Reusable components used throughout the application.
    - **lib/**: Utility functions for API calls.
    - **types/**: TypeScript types and interfaces.
  - **package.json**: Configuration for npm dependencies and scripts.
  - **tsconfig.json**: TypeScript configuration file.
  - **next.config.js**: Next.js configuration settings.

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

## Getting Started

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies using npm:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the `backend` directory.
2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
4. Run the Django server:
   ```
   python manage.py runserver
   ```

## Web Scraping

The backend includes a web scraping component that automatically gathers data about Macomb. You can run the scraping command using:
```
python manage.py scrape_data
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.