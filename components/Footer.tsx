// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gray-100 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Trinityx LLC. All rights reserved.
        </div>
      </footer>
    )
  }
  