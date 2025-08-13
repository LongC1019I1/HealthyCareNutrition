// src/pages/WeightControlGoals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { VARIABLE } from "../../Data/variable"; // chỉnh nếu khác

export default function Target() {
  const token = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const { data: user } = useSelector((state) => state.user);
  const [goals, setGoals] = useState({
    steps: 8000,
    targetWeight: "",
    targetCalories: 300,
    sleepHours: 8,
    finishMonths: 3,
  });
  const [tracking, setTracking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch user (nếu có endpoint /user/:username)
        // const u = await axios.get(`${VARIABLE.url}/user/${username}`, { headers: { x_authorization: token }});
        // setUser(u.data.user);

        // fetch goals
        const res = await axios.get(`${VARIABLE.url}/target/${user.username}`, {
          headers: { x_authorization: token },
        });
        if (res.data?.goals) setGoals(res.data.goals);
        if (res.data?.tracking) {
          setTracking(
            res.data.tracking.map((row) => ({
              ...row,
            }))
          );
        }
      } catch (err) {
        console.error("Fetch goals error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleGoalChange = (field, value) => {
    setGoals((g) => ({ ...g, [field]: value }));
  };

  const handleTrackingChange = (index, field, value) => {
    console.log({ value });
    setTracking((arr) => {
      const newArr = [...arr];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const addTrackingRow = () => {
    setTracking((arr) => [
      {
        date: dayjs(new Date()).format("DD-MM-YYYY"),
        weight: "",
        fat: "",
        bone: "",
        water: "",
        muscle: "",
        balanceIndex: "",
        rmr: "",
        bioAge: "",
        visceralFat: "",
        waist: "",
      },
      ...arr,
    ]);
  };

  const removeTrackingRow = (idx) => {
    setTracking((arr) => arr.filter((_, i) => i !== idx));
  };

  const saveGoals = async (e) => {
    e?.preventDefault();
    try {
      await axios.put(
        `${VARIABLE.url}/target/${user.username}`,
        { goals, tracking },
        {
          headers: { x_authorization: token, Authorization: `Bearer ${token}` },
        }
      );
      alert("Lưu mục tiêu thành công");
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    }
  };

  if (loading) return <div className="container py-4">Đang tải...</div>;

  console.log({ tracking });

  return (
    <div className="container py-4">
      {/* Avatar + tên (nếu có) */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex align-items-center justify-content-center gap-3">
          <div>
            <img
              src={(user && user.avatar) || "https://via.placeholder.com/80"}
              alt="avatar"
              className="rounded-circle mb-4"
              style={{ width: 80, height: 80, objectFit: "cover" }}
            />

            <h5 className="mb-0">{(user && user.fullname) || "Người dùng"}</h5>
            <small className="text-muted">
              Cập nhật mục tiêu kiểm soát cân nặng
            </small>
          </div>
        </div>
      </div>

      <form onSubmit={saveGoals} className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">
          <i className="bi bi-flag-fill me-2"></i>Mục tiêu của tôi
        </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Số bước mục tiêu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-shoe-fill"></i>
              </span>
              <input
                className="form-control"
                type="number"
                value={goals.steps}
                onChange={(e) => handleGoalChange("steps", e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">Mục tiêu cân nặng (kg)</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                className="form-control"
                type="number"
                value={goals.targetWeight}
                onChange={(e) =>
                  handleGoalChange("targetWeight", e.target.value)
                }
              />
              <span className="input-group-text">kg</span>
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">Thời gian hoàn thành (tháng)</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-hourglass-split"></i>
              </span>
              <input
                className="form-control"
                type="number"
                value={goals.finishMonths}
                onChange={(e) =>
                  handleGoalChange("finishMonths", e.target.value)
                }
              />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label">Calo mục tiêu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-fire"></i>
              </span>
              <input
                className="form-control"
                type="number"
                value={goals.targetCalories}
                onChange={(e) =>
                  handleGoalChange("targetCalories", e.target.value)
                }
              />
              <span className="input-group-text">kcal</span>
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">Giờ ngủ mục tiêu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-moon-fill"></i>
              </span>
              <input
                className="form-control"
                type="number"
                value={goals.sleepHours}
                onChange={(e) => handleGoalChange("sleepHours", e.target.value)}
              />
              <span className="input-group-text">giờ</span>
            </div>
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <button type="submit" className="btn btn-success">
            <i className="bi bi-save2 me-1"></i> Lưu mục tiêu
          </button>
        </div>
      </form>

      <div className="card p-3 shadow-sm">
        <h5 className="mb-3">
          <i className="bi bi-clipboard-data-fill me-2"></i>Bảng theo dõi chỉ số
        </h5>
        <div className="table-responsive">
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>Ngày</th>
                <th>Cân nặng</th>
                <th>Mỡ(%)</th>
                <th>Xương</th>
                <th>Nước(%)</th>
                <th>Cơ</th>
                <th>Chỉ số</th>
                <th>RMR</th>
                <th>Tuổi sinh học</th>
                <th>Mỡ nội tạng</th>
                <th>Vòng eo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tracking.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <DatePicker
                      format="DD/MM/YYYY"
                      onChange={(date) =>
                        handleTrackingChange(
                          idx,
                          "date",
                          dayjs(date).format("DD-MM-YYYY")
                        )
                      }
                      className="form-control form-control-sm"
                      value={row.date || ""}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.weight || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "weight", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.fat || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "fat", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.bone || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "bone", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.water || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "water", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.muscle || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "muscle", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.balanceIndex || ""}
                      onChange={(e) =>
                        handleTrackingChange(
                          idx,
                          "balanceIndex",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.rmr || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "rmr", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.bioAge || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "bioAge", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.visceralFat || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "visceralFat", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={row.waist || ""}
                      onChange={(e) =>
                        handleTrackingChange(idx, "waist", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeTrackingRow(idx)}
                      type="button"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={addTrackingRow}>
            <i className="bi bi-plus-circle me-1"></i> Thêm dòng
          </button>
          <button className="btn btn-success ms-auto" onClick={saveGoals}>
            <i className="bi bi-cloud-arrow-up me-1"></i> Lưu tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
