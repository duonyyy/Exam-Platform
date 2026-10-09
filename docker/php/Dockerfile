FROM php:8.3-fpm

# Install git, zip, unzip, curl for Composer and runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    zip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install PHP extensions via official docker-php-extension-installer
COPY docker/php/install-php-extensions /usr/local/bin/install-php-extensions
RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions \
    pdo_pgsql \
    pgsql \
    zip \
    bcmath \
    pcntl \
    opcache \
    redis

# Get Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

EXPOSE 9000
CMD ["php-fpm"]
