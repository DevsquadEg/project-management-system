import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Login Data:", data);
  };

  return (
    <>
      <div className="auth-container w-100 vh-100 bg-info">
        <div className="container-fluid">
          <div className="w-100 py-5 d-flex justify-content-center">
            <img className="" src="/pmsLogo.svg" alt="pmslogo" />
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col-md-10 col-lg-6 px-sm-4 px-md-5 py-4 auth-area rounded shadow">
              <Form onSubmit={handleSubmit(onSubmit)} className="text-start">
                <div className="text-start mb-4">
                  <small className="text-white">welcome to PMS</small>
                  <h2 className="text-warning fw-bold m-0">Login</h2>
                </div>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="text-warning fw-semibold">
                    E-mail
                  </Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="text-warning fw-semibold">
                    Password
                  </Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
