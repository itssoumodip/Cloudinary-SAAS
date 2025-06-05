# Cloudinary Showcase

A Next.js application for advanced media management with Cloudinary integration. This application provides tools for video compression, image optimization, and social media asset creation.

![Cloudinary Showcase](https://res.cloudinary.com/demo/image/upload/c_scale,w_700/v1612371119/cloudinary-logo-vector.svg)

### Key Features

- **Video Compression**: Automatically compress videos while maintaining clarity, saving bandwidth and storage
- **Social Media Format Tools**: Create perfectly sized images for Instagram, Twitter, Facebook, and more with a single click
- **Cloud Storage**: Store all your media files securely in the cloud and access them from anywhere
- **User Dashboard**: Manage your uploaded media through an intuitive interface

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes, Cloudinary API
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **Styling**: TailwindCSS

## Project Structure

The application is structured as follows:

- `/app`: Main application pages using Next.js App Router
- `/app/(app)`: Protected routes for authenticated users
- `/app/(auth)`: Authentication routes (sign-in, sign-up)
- `/app/api`: API routes for image and video operations
- `/components`: Reusable UI components
- `/prisma`: Database schema and migrations

## Implementation Details

1. **Video Processing**:
   - Upload videos securely to Cloudinary
   - Process videos with various compression options
   - Download processed videos in different formats

2. **Social Media Tools**:
   - Generate perfectly sized images for each platform
   - Apply filters and transformations
   - Add text and overlays for enhanced engagement

3. **User Authentication**:
   - Secure sign-in and sign-up functionality
   - User-specific media libraries
   - Access control for uploaded content

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Setup

To run this project locally, you'll need to set up the following environment variables in your `.env.local` file:

```bash
DATABASE_URL="your_postgresql_connection_string"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Setup

This project uses Prisma with PostgreSQL. To set up the database:

```bash
# Apply migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Remember to configure the environment variables in your Vercel project settings.

## License

[MIT](https://choosealicense.com/licenses/mit/)
