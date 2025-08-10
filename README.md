# MovIQ - Movie Recommendation App

## Overview

MovIQ is a movie recommendation application built with Next.js and TypeScript. It allows users to browse trending movies, search for specific titles, view detailed movie information, and save their favorite movies for later viewing.

## Features

- **Browse Trending Movies**: Discover the latest trending movies on the home page.
- **Movie Recommendations**: Get personalized movie recommendations based on trending movies.
- **Movie Details**: View detailed information about movies, including synopsis, cast, ratings, and more.
- **Search Functionality**: Search for movies by title, genre, or keywords.
- **Favorites**: Save your favorite movies to a personal collection for easy access.
- **Responsive Design**: Enjoy a seamless experience across all devices, from desktop to mobile.

## Technologies Used

- **Next.js**: For server-side rendering and dynamic routing.
- **TypeScript**: For type safety and improved developer experience.
- **Styled Components**: For component-based styling with theming support.
- **Axios**: For making API requests to The Movie Database (TMDB) API.
- **Local Storage**: For saving user favorites locally.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- TMDB API key (required for movie data)

### Getting a TMDB API Key

1. Visit [The Movie Database (TMDB) website](https://www.themoviedb.org/) and create an account if you don't have one.
2. After logging in, go to your account settings by clicking on your avatar in the top right corner and selecting "Settings".
3. In the left sidebar, click on "API".
4. Follow the instructions to request an API key for developer use.
5. Once approved, you'll receive an API key that you can use with this application.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/moviq.git
   cd moviq
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your TMDB API key:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB API key for fetching movie data | Yes |

### Building for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
```

Then, you can start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `src/components`: Reusable UI components
- `src/hooks`: Custom React hooks
- `src/pages`: Next.js pages and API routes
- `src/styles`: Global styles and theme
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions and API client

## Deployment

The application can be deployed using Vercel or Netlify for easy access and testing.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API.
- [Next.js](https://nextjs.org/) for the React framework.
- [Styled Components](https://styled-components.com/) for the styling solution.
