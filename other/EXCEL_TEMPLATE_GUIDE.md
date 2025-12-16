# Sample Excel Template for Student Upload

## Excel File Format

Create an Excel file (.xlsx or .xls) with the following columns:

### Required Columns:

1. **studentId** (String)
   - Unique identifier for the student
   - Alphanumeric (letters and numbers)
   - Example: STU001, STUD2025001, etc.
   - Must be unique across all students

2. **name** (String)
   - Student's full name
   - 2-100 characters
   - Example: John Doe, Jane Smith

3. **email** (String)
   - Valid email address
   - Must follow email format
   - Example: john.doe@example.com

4. **internshipDomain** (String)
   - Field of internship
   - Examples: 
     - Web Development
     - Data Science
     - Machine Learning
     - Mobile App Development
     - Digital Marketing
     - UI/UX Design

5. **startDate** (Date)
   - Internship start date
   - Format: YYYY-MM-DD or MM/DD/YYYY
   - Excel date format also accepted
   - Example: 2025-01-01, 01/01/2025

6. **endDate** (Date)
   - Internship end date
   - Format: YYYY-MM-DD or MM/DD/YYYY
   - Must be after startDate
   - Excel date format also accepted
   - Example: 2025-03-01, 03/01/2025

### Optional Columns:

7. **phone** (String)
   - 10-digit phone number
   - Example: 1234567890

## Sample Data

Here's an example of how your Excel file should look:

| studentId | name | email | phone | internshipDomain | startDate | endDate |
|-----------|------|-------|-------|------------------|-----------|---------|
| STU001 | John Doe | john.doe@email.com | 1234567890 | Web Development | 2025-01-01 | 2025-03-01 |
| STU002 | Jane Smith | jane.smith@email.com | 9876543210 | Data Science | 2025-01-15 | 2025-04-15 |
| STU003 | Bob Johnson | bob.j@email.com | 5551234567 | Machine Learning | 2025-02-01 | 2025-05-01 |
| STU004 | Alice Williams | alice.w@email.com | 5559876543 | Mobile App Development | 2025-01-10 | 2025-04-10 |
| STU005 | Charlie Brown | charlie.b@email.com | 5555551234 | Digital Marketing | 2025-01-20 | 2025-03-20 |

## Creating the Excel File

### Method 1: Microsoft Excel
1. Open Microsoft Excel
2. Create a new workbook
3. Add column headers in the first row (as shown above)
4. Fill in student data starting from row 2
5. Save as .xlsx or .xls format

### Method 2: Google Sheets
1. Open Google Sheets
2. Create a new spreadsheet
3. Add column headers in the first row
4. Fill in student data starting from row 2
5. Download as Excel (.xlsx) format:
   - File → Download → Microsoft Excel (.xlsx)

### Method 3: LibreOffice Calc
1. Open LibreOffice Calc
2. Create a new spreadsheet
3. Add column headers in the first row
4. Fill in student data starting from row 2
5. Save as .xlsx or .xls format

## Important Notes

### ✅ Do's:
- Ensure all required fields are filled
- Use consistent date formats
- Keep studentId unique for each student
- Use valid email formats
- Ensure endDate is after startDate
- Keep file size under 5MB
- Use only .xlsx or .xls format
- Double-check data before uploading

### ❌ Don'ts:
- Don't leave required fields empty
- Don't use duplicate studentId
- Don't use invalid email formats
- Don't set endDate before startDate
- Don't exceed file size limit (5MB)
- Don't use unsupported file formats (.csv, .txt, etc.)
- Don't include extra sheets (only first sheet is processed)
- Don't merge cells or use complex formatting

## Validation Rules

The system will validate each row and reject entries that don't meet these criteria:

1. **studentId**:
   - Must not be empty
   - Must be unique
   - No special characters except underscore and hyphen

2. **name**:
   - Must not be empty
   - 2-100 characters
   - Can contain letters, spaces, and basic punctuation

3. **email**:
   - Must not be empty
   - Must be a valid email format
   - Example: username@domain.com

4. **phone** (optional):
   - Must be exactly 10 digits
   - Only numbers, no spaces or special characters

5. **internshipDomain**:
   - Must not be empty
   - Any text is accepted

6. **startDate**:
   - Must not be empty
   - Must be a valid date
   - Can be past, present, or future date

7. **endDate**:
   - Must not be empty
   - Must be a valid date
   - Must be after startDate

## Upload Results

After uploading, you'll see:

### Success Message:
```
✅ Successfully uploaded X students
```

### Partial Success:
```
⚠️ Uploaded X students successfully
⚠️ Y records failed to upload
```

### Failed Records Table:
The system will show which rows failed and why:
- Row number in Excel
- Student data (if available)
- Specific error message

### Common Errors:

1. **"Missing required fields"**
   - One or more required columns are empty
   - Solution: Fill in all required fields

2. **"Student ID already exists"**
   - Duplicate studentId found
   - Solution: Use unique studentId for each student

3. **"Invalid date format"**
   - Date is not in a recognized format
   - Solution: Use YYYY-MM-DD or MM/DD/YYYY format

4. **"End date must be after start date"**
   - endDate is before or same as startDate
   - Solution: Ensure endDate is after startDate

5. **"Invalid email format"**
   - Email doesn't follow standard format
   - Solution: Use format like name@domain.com

6. **"Invalid phone number"**
   - Phone is not exactly 10 digits
   - Solution: Use 10-digit number without spaces or special characters

## Download Sample Template

A sample Excel template with correct formatting is available in the repository:
- File: `student-upload-template.xlsx`
- Location: `/backend/templates/`

## Tips for Large Uploads

If uploading many students:

1. **Split into smaller batches**: Upload 50-100 students at a time
2. **Verify data first**: Check a small batch before uploading all
3. **Keep backups**: Save original Excel file before modifications
4. **Use consistent formatting**: Maintain same format for all batches
5. **Check error reports**: Review failed uploads and fix issues

## Example Workflow

1. **Prepare Data**:
   - Collect student information
   - Organize in Excel format
   - Verify all required fields are filled

2. **Validate Locally**:
   - Check for duplicate studentIds
   - Verify email formats
   - Ensure dates are correct
   - Confirm phone numbers are 10 digits

3. **Upload**:
   - Login to admin dashboard
   - Go to "Upload Students" tab
   - Select your Excel file
   - Click "Upload Students"

4. **Review Results**:
   - Check success count
   - Review any failed uploads
   - Fix errors in original file if needed
   - Re-upload failed records

5. **Generate Certificates**:
   - Go to "Manage Students" tab
   - Verify uploaded students
   - Generate certificates as needed

## Support

If you encounter issues:
1. Check this documentation
2. Verify Excel format matches template
3. Review error messages carefully
4. Contact system administrator if problems persist

## Quick Reference

**File Requirements:**
- Format: .xlsx or .xls
- Size: Max 5MB
- Sheets: Only first sheet is processed

**Column Order:**
Order doesn't matter, but these column names must be exact:
- studentId
- name
- email
- phone (optional)
- internshipDomain
- startDate
- endDate

**Date Formats Accepted:**
- 2025-01-01
- 01/01/2025
- 2025/01/01
- Excel date format

**Time to Upload:**
- Small files (< 100 rows): Few seconds
- Medium files (100-500 rows): 10-30 seconds
- Large files (500-1000 rows): 30-60 seconds
