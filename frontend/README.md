# Frontend - Certificate Verification System

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.js
│   │   └── PrivateRoute.js
│   ├── context/            # React Context
│   │   └── AuthContext.js
│   ├── pages/              # Page components
│   │   ├── Home.js
│   │   ├── AdminLogin.js
│   │   ├── AdminRegister.js
│   │   ├── AdminDashboard.js
│   │   ├── StudentSearch.js
│   │   └── CertificateView.js
│   ├── utils/              # Utility functions
│   │   └── api.js
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles
│   ├── index.js            # Entry point
│   └── index.css
├── .env
├── .gitignore
└── package.json
```

## Features

### 1. Home Page
- Landing page with feature overview
- Links to search and admin login
- Responsive design

### 2. Admin Registration & Login
- Form validation with Formik and Yup
- Secure authentication
- Error handling
- Redirect to dashboard on success

### 3. Admin Dashboard
- Statistics overview (Total students, certificates issued, pending)
- Two main tabs:
  - **Upload Students**: Bulk upload via Excel
  - **Manage Students**: View and generate certificates
- Real-time feedback on operations
- Pagination support

### 4. Student Certificate Search
- Public search by Certificate ID
- Input validation
- Rate limiting feedback
- Help section

### 5. Certificate View
- Display all certificate details
- Download as PDF
- Verification status
- Duration calculation
- Responsive design

## Components

### AuthContext
Manages authentication state globally:
- `admin`: Current admin object
- `token`: JWT token
- `loading`: Loading state
- `login()`: Login function
- `register()`: Register function
- `logout()`: Logout function
- `isAuthenticated`: Boolean flag

### PrivateRoute
Protects routes that require authentication:
```jsx
<PrivateRoute>
  <AdminDashboard />
</PrivateRoute>
```

### Navbar
Navigation bar with:
- Logo/brand
- Navigation links
- Conditional rendering based on auth state
- Logout button

## API Integration

### API Client (`utils/api.js`)
Axios instance with:
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)
- Organized API methods:
  - `authAPI`: Authentication endpoints
  - `adminAPI`: Admin operations
  - `certificateAPI`: Certificate operations

### Example Usage:
```javascript
import { authAPI } from '../utils/api';

const result = await authAPI.login({ email, password });
```

## State Management

### Context API
Used for global authentication state:
- Simplified state management
- No need for Redux for this application
- Easy to extend for additional global state

### Local State
Component-level state using `useState`:
- Form inputs
- Loading states
- Error states
- Data fetching results

## Form Validation

### Formik + Yup
- Declarative form validation
- Field-level validation
- Error display
- Submission handling

Example schema:
```javascript
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Min 6 characters')
    .required('Password is required')
});
```

## Styling

### CSS Architecture
- Global styles in `App.css`
- Component-specific styles inline or in the same file
- Responsive design with media queries
- CSS Variables for theming (future enhancement)

### Design System
- Primary color: #667eea (purple)
- Secondary color: #764ba2 (dark purple)
- Success: #2ecc71 (green)
- Error: #ff4757 (red)
- Warning: #f39c12 (orange)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## User Flows

### Admin Flow
```
Registration → Login → Dashboard → Upload Students → Generate Certificates
```

### Student Flow
```
Home → Search → Enter Certificate ID → View Details → Download PDF
```

## Error Handling

### Types of Errors Handled:
1. **Network Errors**: Connection issues
2. **Validation Errors**: Form validation
3. **API Errors**: Server responses
4. **Authentication Errors**: Invalid tokens
5. **File Upload Errors**: Invalid files

### Error Display:
- Toast notifications (react-toastify)
- Inline form errors
- Error containers for major errors

## Loading States

All async operations show loading indicators:
- Button loading states
- Page loading spinners
- Skeleton loaders (future enhancement)

## Security Features

### Frontend Security:
1. **Input Validation**: Client-side validation
2. **XSS Prevention**: React's built-in escaping
3. **Token Storage**: localStorage (consider httpOnly cookies for production)
4. **HTTPS**: Required in production
5. **CORS**: Configured in backend

### Best Practices:
- No sensitive data in localStorage
- Token expiration handling
- Automatic logout on 401
- Input sanitization

## Performance Optimization

### Current Optimizations:
- Code splitting with React Router
- Lazy loading (can be added)
- Optimized images
- Minimal dependencies

### Future Optimizations:
- React.memo for expensive components
- useMemo and useCallback
- Virtual scrolling for large lists
- Image lazy loading
- Service workers for offline support

## Testing

### Manual Testing Checklist:
- [ ] Registration with valid data
- [ ] Registration with invalid data
- [ ] Login with correct credentials
- [ ] Login with wrong credentials
- [ ] Upload valid Excel file
- [ ] Upload invalid file
- [ ] Generate certificate
- [ ] Search existing certificate
- [ ] Search non-existent certificate
- [ ] Download certificate
- [ ] Logout

### Future: Automated Testing
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Netlify
1. Build: `npm run build`
2. Publish directory: `build`
3. Set environment variables

### Traditional Hosting
1. Build production bundle
2. Upload `build/` folder
3. Configure web server (Nginx/Apache)
4. Set up SSL certificate

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Production:**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Browser Compatibility

Supports:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Troubleshooting

### Issue: CORS Error
- Check backend CORS configuration
- Verify API URL in .env

### Issue: Cannot Connect to Backend
- Ensure backend is running
- Check API URL
- Verify network connectivity

### Issue: Token Expired
- Login again
- Check token expiration time in backend

### Issue: File Upload Not Working
- Check file format (.xlsx, .xls)
- Verify file size (< 5MB)
- Check network connection

## Development Tips

### Hot Reload
Changes automatically reload during development.

### Console Errors
Check browser console for React warnings and errors.

### Network Tab
Use browser DevTools Network tab to debug API calls.

### React DevTools
Install React DevTools extension for component debugging.

## Future Enhancements

1. **Dark Mode**: Theme switcher
2. **Internationalization**: Multi-language support
3. **PWA**: Progressive Web App features
4. **Offline Support**: Service workers
5. **Advanced Search**: Filters and sorting
6. **Bulk Operations**: Multiple certificate generation
7. **Analytics**: Usage statistics
8. **Notifications**: Real-time updates
9. **Print View**: Optimized certificate printing
10. **Mobile App**: React Native version

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Support

For issues or questions:
- Check documentation
- Review error messages
- Contact system administrator
