import { useParams, useNavigate } from "react-router-dom";

interface CrudProps {
  id?: string;
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
}

const withCrudPage = <P extends object>(WrappedComponent: React.ComponentType<P & CrudProps>) => {
  return (props: any ) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditMode = Boolean(id);

    return (
      <WrappedComponent
        {...props}
        id={id}
        navigate={navigate}
        isEditMode={isEditMode}
      />
    );
  };
};

export default withCrudPage;