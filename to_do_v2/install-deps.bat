@echo off
echo Installing dependencies...
call npm install --save-dev jest @testing-library/jest-dom @testing-library/react jest-environment-jsdom babel-jest
echo Done.
pause