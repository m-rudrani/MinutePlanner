#!/usr/bin/env python3
"""
Validation script to check if Python backend setup is working correctly.
Run this script to verify all dependencies and configurations.
"""

import sys
import os
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required")
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def check_requirements():
    """Check if required packages can be imported"""
    required_packages = [
        "fastapi",
        "uvicorn", 
        "pydantic",
        "python_dotenv"
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} installed")
        except ImportError:
            print(f"❌ {package} missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\nInstall missing packages:")
        print(f"pip install {' '.join(missing_packages)}")
        return False
    
    return True

def check_shared_modules():
    """Check if shared modules can be imported"""
    try:
        # Add parent directory to path
        sys.path.append(str(Path(__file__).parent))
        from shared.api import DemoResponse, Place, ItineraryResponse
        print("✅ Shared API models can be imported")
        return True
    except ImportError as e:
        print(f"❌ Cannot import shared modules: {e}")
        return False

def check_server_file():
    """Check if main server file exists and is valid"""
    server_file = Path("server/main.py")
    if not server_file.exists():
        print("❌ server/main.py not found")
        return False
    
    print("✅ server/main.py exists")
    
    # Basic syntax check
    try:
        with open(server_file) as f:
            compile(f.read(), server_file, 'exec')
        print("✅ server/main.py syntax is valid")
        return True
    except SyntaxError as e:
        print(f"❌ Syntax error in server/main.py: {e}")
        return False

def main():
    """Run all validation checks"""
    print("🐍 Python Backend Validation\n")
    
    checks = [
        check_python_version,
        check_requirements,
        check_shared_modules,
        check_server_file
    ]
    
    all_passed = True
    for check in checks:
        if not check():
            all_passed = False
        print()
    
    if all_passed:
        print("🎉 All checks passed! Python backend is ready.")
        print("\nTo start the server:")
        print("cd server && python main.py")
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        print("\nSetup instructions:")
        print("1. pip install -r requirements.txt")
        print("2. Run this script again to verify")

if __name__ == "__main__":
    main()
