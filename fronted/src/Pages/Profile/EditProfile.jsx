import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // lấy dữ liệu từ Redux
import { VARIABLE } from "../../Data/variable";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data); // lấy user từ Redux
  const [formData, setFormData] = useState(null);
  const [beforeImg, setBeforeImg] = useState("");
  const [afterImg, setAfterImg] = useState("");
  const [avatarImg, setAvatarImg] = useState("");

  // Khi user từ Redux thay đổi, set vào formData
  useEffect(() => {
  
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "beforeImg") {
        setBeforeImg(files[0]);
      } else if (name === "afterImg") {
        setAfterImg(files[0]);
      } else if (name === "avatar") {
        setFormData({ ...formData, avatar: URL.createObjectURL(files[0]) });
        setAvatarImg(files[0]);
      }
      setFormData({ ...formData, [name]: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("image", file);
    const res = await axios.post(`${VARIABLE.url}/upload`, data);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let beforeImageUrl = formData.beforeImg;
      let afterImageUrl = formData.afterImg;
      let avatarImageUrl = formData.avatarImg;
      if (beforeImg) {
        beforeImageUrl = await uploadImage(beforeImg);
      }
      if (afterImg) {
        afterImageUrl = await uploadImage(afterImg);
      }
      if (avatarImg) {
        avatarImageUrl = await uploadImage(avatarImg);
      }

      const updatedData = {
        ...formData,
        beforeImg: beforeImageUrl,
        afterImg: afterImageUrl,
        avatar: avatarImageUrl,
      };

      await axios.put(`${VARIABLE.url}/user/edit`, updatedData);
      alert("Cập nhật hồ sơ thành công!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  if (!formData) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="container my-5">
      <div className="card shadow rounded-4 p-4">
        <h2 className="text-center mb-4">Chỉnh sửa hồ sơ sức khỏe</h2>

        <form onSubmit={handleSubmit}>
          {/* Thông tin cá nhân */}
          <div className="row">
            <div className="text-center mb-4">
              <label htmlFor="avatarUpload" style={{ cursor: "pointer" }}>
                <img
                  src={formData.avatar || "https://via.placeholder.com/120"}
                  alt="Avatar"
                  className="rounded-circle shadow"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </label>
              <input
                type="file"
                id="avatarUpload"
                name="avatar"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <div className="mt-2 text-muted">Avatar</div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Họ tên</label>
              <input
                type="text"
                className="form-control"
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Tuổi</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Chiều cao (cm)</label>
              <input
                type="text"
                className="form-control"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Thông tin cân nặng */}
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Cân nặng trước (kg)</label>
              <input
                type="text"
                className="form-control"
                name="weightBefore"
                value={formData.weightBefore || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Cân nặng hiện tại (kg)</label>
              <input
                type="text"
                className="form-control"
                name="weightAfter"
                value={formData.weightAfter || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Chỉ số BMI</label>
              <input
                type="text"
                className="form-control"
                name="bmi"
                value={formData.bmi || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Thời gian thay đổi</label>
              <input
                type="text"
                className="form-control"
                name="duration"
                value={formData.duration || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Câu chuyện */}
          <div className="mb-3">
            <label className="form-label">Câu chuyện thay đổi</label>
            <textarea
              className="form-control"
              name="story"
              rows="4"
              value={formData.story || ""}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Ảnh */}
          <div className="row mb-4">
            <div className="col-md-6 text-center">
              <label className="form-label">Ảnh trước</label>
              <input
                type="file"
                className="form-control mb-2"
                name="beforeImg"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.beforeImg && (
                <img
                  src={formData.beforeImg}
                  alt="Trước"
                  className="img-fluid rounded shadow"
                />
              )}
            </div>
            <div className="col-md-6 text-center">
              <label className="form-label">Ảnh sau</label>
              <input
                type="file"
                className="form-control mb-2"
                name="afterImg"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.afterImg && (
                <img
                  src={formData.afterImg}
                  alt="Sau"
                  className="img-fluid rounded shadow"
                />
              )}
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success px-5">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
