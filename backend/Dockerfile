# Use the official Node.js 18 image as the base
FROM node:18 as node

# Set the working directory for the Node.js part
WORKDIR /backend

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the Node.js dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Switch to PHP image for the Symfony part
FROM php:8.2-cli

# Install zip and unzip packages
RUN apt-get update && apt-get install -y \
    zip \
    unzip \
    curl \
    libicu-dev # Install ICU development package for "intl" extension

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN docker-php-ext-install pdo pdo_mysql intl # Enable "intl" extension

# Set the working directory for the PHP part
WORKDIR /app

# Copy the composer.json and composer.lock files
COPY composer.json composer.lock ./

# Install dependencies using Composer
RUN composer install

# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash && \
    mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

# Copy the rest of the application code
COPY . .

# Expose port 8000 for Symfony dev server
EXPOSE 8000

# Start Webpack
CMD ["npm", "run", "watch"]

# Start Symfony dev server
CMD ["symfony", "server:start", "--no-tls"]