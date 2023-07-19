<#
.SYNOPSIS
Combines the contents of multiple JavaScript files into a single file.

.DESCRIPTION
This script finds all JavaScript files in the "components" folder and combines their contents, 
along with the contents of "App.js" and "App.css", into a single file named "bundle.js".

.NOTES
Created by [Your Name]
Date: [Date]
#>

# Set the path to the directory containing the input files.
$InputPath = ".\src\components"

# Set the path and name for the output file.
$OutputPath = ".\src\combinedFiles.txt"

# Define a function that adds a specified number of blank lines to a file.
function Add-BlankLines {
    param (
        [string]$Path,
        [int]$NumLines
    )
    for ($i=0; $i -lt $NumLines; $i++) {
        Add-Content -Path $Path ""
    }
}

# Create a new output file, overwriting any existing file with the same name.
New-Item -Path $OutputPath -ItemType "file" -Force

# Get all JavaScript files in the input directory, and for each file,
# add its contents to the output file and add 3 blank lines.
Get-ChildItem -Path $InputPath -Filter "*.js" | ForEach-Object {
    Get-Content $_.FullName | Add-Content -Path $OutputPath
    Add-BlankLines -Path $OutputPath -NumLines 3
}

# Append the contents of "App.js" to the output file, and add 3 blank lines.
Get-Content ".\src\App.js" | Add-Content -Path $OutputPath
Add-BlankLines -Path $OutputPath -NumLines 3

# Append the contents of "App.css" to the output file, and add 3 blank lines.
Get-Content ".\src\App.css" | Add-Content -Path $OutputPath
Add-BlankLines -Path $OutputPath -NumLines 3

# Append the contents of "package.json" to the output file, and add 3 blank lines.
Get-Content ".\package.json" | Add-Content -Path $OutputPath
Add-BlankLines -Path $OutputPath -NumLines 3
