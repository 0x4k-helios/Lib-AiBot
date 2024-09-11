import { Link } from "react-router-dom";
import PageTitle from "../PageTitle";

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <PageTitle title="404 Page Not Found" />
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="m-4 text-lg">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
