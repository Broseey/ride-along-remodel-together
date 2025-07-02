import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const suggestedRoutes = [
    { path: "/", label: "Home", description: "Return to the main page" },
    { path: "/drive", label: "Drive & Earn", description: "Join as a driver" },
    { path: "/signin", label: "Sign In", description: "Access your account" },
    { path: "/help", label: "Help Center", description: "Get support" },
    {
      path: "/about",
      label: "About Us",
      description: "Learn more about Uniride",
    },
  ];

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>Page Not Found | Uniride</title>
          <meta
            name="description"
            content="Sorry, the page you are looking for does not exist. Return to Uniride to find safe, affordable rides for students across Nigeria."
          />
          <meta property="og:title" content="Page Not Found | Uniride" />
          <meta
            property="og:description"
            content="Sorry, the page you are looking for does not exist. Return to Uniride to find safe, affordable rides for students across Nigeria."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://uniride.ng/404" />
          <meta property="og:image" content="/og-cover.png" />
        </Helmet>

        <div className="min-h-screen bg-gray-50 flex flex-col">
          <nav className="bg-black py-4 px-6">
            <div className="max-w-7xl mx-auto">
              <Link to="/">
                <span className="text-white font-bold text-2xl tracking-tight">
                  Uniride
                </span>
              </Link>
            </div>
          </nav>

          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-16 w-16 text-gray-400" />
                </div>
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Page Not Found
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Sorry, we couldn't find the page you're looking for. The page
                  might have been moved, deleted, or you entered the wrong URL.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Requested path:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {location.pathname}
                  </code>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/">
                  <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Pages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedRoutes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="font-medium text-gray-900">
                        {route.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {route.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="bg-gray-900 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
              <p>© 2024 Uniride. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </>
    </HelmetProvider>
  );
};

export default NotFound;
