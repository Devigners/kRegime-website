# Admin Settings Feature

## Overview
Complete backend and database implementation for the admin settings page, including bank account management and password security features. The admin password is now stored in the database and can be changed through the settings page.

## Default Credentials
- **Username**: `admin@kregime.com`
- **Default Password**: `3WC08Wyu01`

The default password is automatically hashed and stored in the database upon first login. After that, the password can be changed through the settings page.

## Database Schema

### Table: `admin_settings`
Located in: `/supabase/migrations/20241108000000_add_admin_settings.sql`

**Columns:**
- `id` (UUID, Primary Key) - Unique identifier
- `account_holder_name` (TEXT) - Name of bank account holder
- `bank_name` (TEXT) - Name of the bank
- `account_number` (TEXT) - Bank account number
- `iban` (TEXT) - International Bank Account Number
- `password_hash` (TEXT) - Hashed admin password using bcrypt
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Features:**
- Row Level Security (RLS) enabled
- Automatic timestamps for created_at and updated_at
- Index on updated_at for performance
- Single row constraint (only one settings record allowed)

## API Routes

### POST `/api/admin/login`
Authenticates admin user with username and password stored in database.

**Request Body:**
```json
{
  "username": "admin@kregime.com",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

**Features:**
- Checks username against hardcoded admin username
- Validates password against database-stored hash using bcrypt
- If no password exists in database, uses default password and saves it
- Automatically hashes default password on first login

### GET `/api/admin/settings`
Fetches the current admin settings (excluding password_hash for security).

**Response:**
```json
{
  "id": "uuid",
  "account_holder_name": "string",
  "bank_name": "string",
  "account_number": "string",
  "iban": "string",
  "updated_at": "timestamp"
}
```

### PUT `/api/admin/settings`
Updates admin settings including bank account info and/or password.

**Request Body:**
```json
{
  "account_holder_name": "John Doe",
  "bank_name": "Example Bank",
  "account_number": "1234567890",
  "iban": "GB29NWBK60161331926819",
  "current_password": "optional",
  "new_password": "optional",
  "confirm_password": "optional"
}
```

**Password Requirements:**
- Minimum 8 characters
- Current password required if changing password
- New password must match confirm password
- Passwords are hashed using bcrypt (10 salt rounds)

**Response:**
```json
{
  "message": "Settings updated successfully",
  "data": {
    "id": "uuid",
    "account_holder_name": "John Doe",
    "bank_name": "Example Bank",
    "account_number": "1234567890",
    "iban": "GB29NWBK60161331926819",
    "updated_at": "timestamp"
  }
}
```

**Error Responses:**
- 400: Validation errors (missing fields, password mismatch, etc.)
- 401: Incorrect current password
- 500: Server errors

## Frontend Components

### Admin Login Page (`/admin`)
Location: `/src/app/admin/page.tsx`

**Features:**
- Calls `/api/admin/login` for authentication
- Validates credentials against database
- Shows loading state during authentication
- Displays error messages for invalid credentials
- Redirects to dashboard on successful login

### Settings Page (`/admin/settings`)
Location: `/src/app/admin/settings/page.tsx`

**Features:**
- Real-time form validation
- Loading states during API calls
- Success/error message display
- Auto-dismissing notifications (5 seconds)
- Separate sections for bank account and security
- Password fields clear after successful update
- Data persistence with Supabase

**State Management:**
- `bankAccount` - Bank account information state
- `passwords` - Password change state
- `loading` - Form submission loading state
- `fetchLoading` - Initial data fetch loading state
- `message` - Success/error message state

## Dependencies

### Production Dependencies
- `bcryptjs` - Password hashing library
- `@supabase/supabase-js` - Database client

### Development Dependencies
- `@types/bcryptjs` - TypeScript types for bcryptjs

## Setup Instructions

### 1. Install Dependencies
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. Run Database Migration
Apply the migration to create the admin_settings table:
```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL from:
# /supabase/migrations/20241108000000_add_admin_settings.sql
```

### 3. Environment Variables
Ensure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Update TypeScript Types
The database types have been updated in `/src/types/database.ts` to include the `admin_settings` table.

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
2. **Default Password**: Default password `3WC08Wyu01` is automatically hashed on first login
3. **Database Storage**: Passwords are stored as bcrypt hashes in the database, never in plain text
4. **API Authentication**: Login uses POST `/api/admin/login` which validates against database
5. **Password Changes**: Old password must be provided and verified before changing to new password
6. **API Protection**: The settings API route should be protected by admin authentication
7. **RLS Policies**: Row Level Security is enabled on the admin_settings table
8. **Sensitive Data**: Password hashes are never returned in API responses
9. **Input Validation**: All inputs are validated before processing

## Usage

### First Time Login
1. Navigate to `/admin`
2. Enter username: `admin@kregime.com`
3. Enter default password: `3WC08Wyu01`
4. Click "Sign In"
5. Default password is automatically hashed and saved to database

### Accessing the Settings Page
Navigate to `/admin/settings` after logging in as admin.

### Updating Bank Account Information
1. Fill in the bank account fields
2. Click "Save Changes"
3. Confirmation message will appear

### Changing Password
1. Enter current password
2. Enter new password (minimum 8 characters)
3. Confirm new password
4. Click "Save Changes"
5. Password fields will clear on success

### Updating Both
You can update bank account information and password in the same operation.

## Testing

### Manual Testing Checklist
- [ ] Create initial settings
- [ ] Update bank account information
- [ ] Change password with correct current password
- [ ] Try changing password with incorrect current password
- [ ] Try changing password with non-matching confirmation
- [ ] Try changing password with less than 8 characters
- [ ] Verify data persists after refresh
- [ ] Check error messages display correctly
- [ ] Verify success messages display and auto-dismiss

## Future Enhancements

Potential improvements for future iterations:
- Multi-factor authentication
- Password strength indicator
- Audit log for settings changes
- Email notification on password change
- Multiple admin users support
- Bank account verification
- Encrypted storage for sensitive fields

## Troubleshooting

### Migration Issues
If the migration fails, check:
- Supabase connection is active
- Service role key has proper permissions
- No conflicting table names exist

### API Errors
If API calls fail:
- Verify environment variables are set
- Check Supabase service role key permissions
- Review browser console for detailed errors
- Check API route logs in terminal

### Password Issues
If password changes fail:
- Ensure current password is correct
- Verify new password meets requirements (8+ chars)
- Check that new password and confirmation match
- Review API response for specific error message

## File Structure
```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                   # Admin login page
│   │   └── settings/
│   │       └── page.tsx               # Settings page component
│   └── api/
│       └── admin/
│           ├── login/
│           │   └── route.ts           # Login authentication API
│           └── settings/
│               └── route.ts           # Settings API (GET, PUT)
├── lib/
│   └── adminAuth.ts                   # Authentication helper (updated to use API)
└── types/
    └── database.ts                     # Updated with admin_settings type

supabase/
└── migrations/
    └── 20241108000000_add_admin_settings.sql  # Database migration
```

## License
This feature is part of the kRegime admin panel system.
