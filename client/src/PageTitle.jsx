import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title} - Library Meta Bot</title>
    </Helmet>
  );
};

export default PageTitle;
