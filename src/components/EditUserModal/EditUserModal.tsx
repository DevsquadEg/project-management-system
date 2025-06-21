import { useForm } from "react-hook-form";
import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { axiosInstance } from "@/service/urls";
import { USERS_URL } from "@/service/api";
import toast from "react-hot-toast";
import { countries } from "countries-list";

export default function EditUserModal({
  show,
  handleClose,
  userData,
  refreshProfile,
}: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: userData });

  const [isSubmitting, setIsSubmitting] = useState(false);

    const countriesList = Object.values(countries)
      .map((country) => ({
        Countryname: country.name,
        countryPhone: country.phone[0],
      }))
      .sort((a, b) => a.Countryname.localeCompare(b.Countryname));
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("userName", data.userName);
      formData.append("email", data.email);
      formData.append("country", data.country);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("confirmPassword", data.confirmPassword);
      if (data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      await axiosInstance.put(USERS_URL.UPDATE_PROFILE, formData);
      toast.success("Profile updated successfully");
      refreshProfile();
      handleClose();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              {...register("userName", { required: true })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              {...register("email", { required: true })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Select {...register("country", { required: true })}>
              <option value="">Select Your Country</option>
              {countriesList.map((c) => (
                <option key={c.Countryname} value={c.Countryname}>
                  {c.Countryname}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" {...register("phoneNumber")} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              {...register("confirmPassword", { required: true })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" {...register("profileImage")} />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
