import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAlert } from "../components/Alert";

export default function CandidateCard({ candidate, token, onDeleted }) {
  const navigate = useNavigate();
  const { success, error } = useAlert();

  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/deleteCandidate/${candidate._id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (onDeleted) onDeleted();
      success("Candidate deleted successfully.");
    } catch (err) {
      error(err.response?.data?.message || "Failed to delete candidate");
    }
  };

  const openModal = () => {
    const modal = document.getElementById(`modal_${candidate._id}`);
    if (modal) modal.showModal();
  };

  return (
    <div className="card card-compact w-full bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl group glass">
      <figure className="relative h-48 overflow-hidden">
        <img src={`http://localhost:3000/upload/${candidate.candidateImage}`} alt={candidate.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {candidate.partySymbol && (
          <div className="absolute top-2 right-2 bg-base-100/80 backdrop-blur rounded-full p-1 shadow-md">
            <img src={`http://localhost:3000/upload/${candidate.partySymbol}`} alt={candidate.partyName} className="w-12 h-12 rounded-full border-2 border-primary" />
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{candidate.name}</h2>
        <p>{candidate.partyName}</p>
        <div className="card-actions justify-end mt-2">
          <button onClick={() => navigate(`/admin/update/${candidate._id}`)} className="btn btn-outline btn-warning btn-sm gap-2">
            <FaEdit /> Update
          </button>
          <button onClick={openModal} className="btn btn-outline btn-error btn-sm gap-2">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {/* Modal for delete confirmation */}
      <dialog id={`modal_${candidate._id}`} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete <span className="font-semibold">{candidate.name}</span>? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn">Cancel</button>
              <button
                className="btn btn-error"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                  document.getElementById(`modal_${candidate._id}`).close();
                }}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}