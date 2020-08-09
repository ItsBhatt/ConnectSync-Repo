import React, { useState } from "react";
import { connect } from "react-redux";
import { loadUser } from "../../redux/action/auth";
import { getAllPosts } from "../../redux/action/posts";
import { setActiveWorkplaces } from "../../redux/action/workplaces";
import WorkPlacePopup from "../Popup/WorkplacePopup";

import "./ProfileStyles.scss";

const Profile = ({
  auth,
  modalView,
  handleChange,
  create,
  join,
  workplace_name,
  workplace_description,
  workplace_type,
  modelRef,
  popupOpenModal,
  setActiveWorkplaces,
  getAllPosts,
  workplaces: { active_workplaces },
}) => {
  const userProps = { ...auth.user };
  const { email, name, profile, workplaces } = userProps;
  const data = [];
  if (active_workplaces.length > 0) {
    active_workplaces.map((workPlaceName, index) => {
      data.push(workPlaceName);
    });
  }
  const [isEditing, setIsEditing] = useState(false);
  const [activeWorkplacesState, setActiveWorkplacesState] = useState(data);
  const [changedCount, setChanged] = useState(0);

  const toggle = (name) => {
    if (activeWorkplacesState.includes(name)) {
      const index = activeWorkplacesState.indexOf(name);
      if (index > -1) {
        activeWorkplacesState.splice(index, 1);
        setChanged(changedCount + 1);
      }
    } else {
      activeWorkplacesState.push(name);
      setChanged(changedCount + 1);
    }
  };

  const activeWorkplaceList = activeWorkplacesState.map((workplace, index) => {
    return (
      <li key={index} className="currentWP">
        {workplace}
      </li>
    );
  });

  const editingWorkplaceList = workplaces.map((workplace, index) => {
    const {
      workplace: { name: workPlaceName },
      status,
    } = workplace;
    if (status === "JOINED" || status === "ADDED") {
      if (activeWorkplacesState.includes(workPlaceName)) {
        return (
          <li
            key={index}
            className="activeWP"
            onClick={() => toggle(workPlaceName)}
          >
            {workPlaceName}
          </li>
        );
      }
      return (
        <li
          key={index}
          className="deActiveWP"
          onClick={() => toggle(workPlaceName)}
        >
          {workPlaceName}
        </li>
      );
    }
  });

    
    return(
        <div className="profile all-center flex-column">
            <div className="profileImageDiv mt-5 mb-4">
                <img src={userProps.img} className="profileImg" />
            </div>
            <h5>{name}</h5>
            <small>{email}</small>
            <p className="lead border-top w-100 text-center m-0 py-3">
            Active Workplaces{' '}
            {!isEditing && (
            <i className="fa fa-pencil" onClick={() => setIsEditing(true)}></i>
            )}
            </p>
            {isEditing && (
                <small className="mb-1">Select your active workplaces:</small>
            )}
            <ul className="w-100 p-0">
                {isEditing ? editingWorkplaceList : activeWorkplaceList}
            </ul>
            {activeWorkplacesState.length < 1 && (
                <small className="alert alert-danger">
                Please select alteast one workplace!
                </small>
            )}
            {isEditing === true && activeWorkplacesState.length > 0 ? (
                <button
                class="btn btn-secondary my-2 p-1 px-3"
                onClick={() => {
                    setIsEditing(false);
                    setActiveWorkplaces(activeWorkplacesState);
                    getAllPosts(active_workplaces);
                }}
                >
                <small>Save</small>
                </button>
            ) : null}
            {!isEditing && (
            <div className="d-flex flex-column">
                <button
                    onClick={() => popupOpenModal('create')}
                    className="px-5 btn-style mt-2 btn btn-primary shadow p-1 mb-2 bg-white rounded"
                >
                    Create +
                </button>
                <button
                    onClick={() => popupOpenModal('join')}
                    className="px-5 mt-2 btn-style btn btn-primary shadow p-1 mb-5 bg-white rounded"
                >
                    Join +
                </button>
            </div>

      )}
      {/* <WorkPlacePopup
        style={{
          position: "absolute",
          zIndex: 100,
          top: 0,
          left: 0,
          right: 0,
          height: 100 + "%",
        }}
        modalView={modalView}
        handleChange={handleChange}
        create={create}
        join={join}
        name={workplace_name}
        description={workplace_description}
        type={workplace_type}
        modelRef={modelRef}
      /> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  workplaces: state.workplaces,
});

export default connect(mapStateToProps, {
  loadUser,
  getAllPosts,
  setActiveWorkplaces,
})(Profile);
