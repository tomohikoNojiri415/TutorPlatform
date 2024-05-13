import { Result } from "antd";
import { useRouteError } from "react-router-dom";

const ErrorContent = ({ status, title, subtitle }) => {
  console.log(status);
  return <Result status={status} title={title} subTitle={subtitle} />;
};

const Errorpage = () => {
  const error = useRouteError();

  console.log("In ErrorPage: " + error);

  if (error.status === 404) {
    return (
      <ErrorContent
        status={`${error.status}`}
        title={`${error.statusText}`}
        subtitle={`${error.error}`}
      />
    );
  }
  return <div>Something went wrong</div>;
};
export default Errorpage;
