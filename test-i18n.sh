#!/bin/bash

echo "Testing next-intl configuration..."

# Check if i18n.ts exists
if [ -f "i18n.ts" ]; then
    echo "✅ i18n.ts exists"
else
    echo "❌ i18n.ts missing"
fi

# Check if messages directory exists
if [ -d "messages" ]; then
    echo "✅ messages directory exists"
    
    # Check if translation files exist
    if [ -f "messages/zh.json" ]; then
        echo "✅ messages/zh.json exists"
    else
        echo "❌ messages/zh.json missing"
    fi
    
    if [ -f "messages/en.json" ]; then
        echo "✅ messages/en.json exists"
    else
        echo "❌ messages/en.json missing"
    fi
else
    echo "❌ messages directory missing"
fi

# Check if middleware.ts exists
if [ -f "middleware.ts" ]; then
    echo "✅ middleware.ts exists"
else
    echo "❌ middleware.ts missing"
fi

# Check if next.config.ts exists
if [ -f "next.config.ts" ]; then
    echo "✅ next.config.ts exists"
else
    echo "❌ next.config.ts missing"
fi

echo "Configuration check complete!"
