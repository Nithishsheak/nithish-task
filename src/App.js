import "./App.css";
import Modal from "react-modal";
import { useState } from "react";
import Select from "react-select";

Modal.setAppElement("#root");
const customStyles = {
  content: {
    top: "0",
    left: "40%",
    right: "0",
    bottom: "0",
    background: "#f9f9f9",
    padding: "0px"
  }
};

const options = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" }
];

export default function App() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [name, setName] = useState("");
  const [segment, setSegment] = useState([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const addNewSegment = () => {
    if (!selectedOption) {
      return alert("Select any option and add");
    }
    setSegment([...segment, { [selectedOption.value]: selectedOption.label }]);
    setSelectedOption(null);
  };
  const onSelectionChange = (value, data, i) => {
    const newSegment = segment.map((seg, j) => {
      if (i === j) {
        seg = { [value.value]: value.label };
      }
      return seg;
    });
    setSegment(newSegment);
  };
  const onSubmit = () => {
    if (!name || !segment.length) {
      return alert("Name and segments cannot be empty !");
    }
    const parms = {
      segment_name: name,
      segment
    };
    alert(JSON.stringify(parms));
    fetch("https://webhook.site/7920fa9b-44d9-4c3d-b138-e560d17a9ea2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parms)
    })
      .then((data) => {
        alert(data);
      })
      .catch(() => {});
  };
  const onCancel = () => {
    setSelectedOption(null);
    setName("");
    setSegment([]);
    closeModal();
  };

  return (
    <div className="App">
      <div>
        <button
          style={{
            color: "steelblue",
            padding: ".8rem 1.6rem",
            margin: "5rem",
            cursor: "pointer",
            border: "1px solid #ddd"
          }}
          onClick={openModal}
        >
          Save Segment
        </button>


        {/* modal */}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="modal-container">
            <div className="modal-header">
              <h2>
                <span onClick={closeModal}>&#11164;</span> Saving Segment
              </h2>
            </div>
            <div className="modal-content">
              <div className="input-box">
                <label htmlFor="segment">Enter the name of the segment</label>
                <input
                  type="text"
                  id="segment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <p>
                To  Your Segment,You need to add to schemas to build the
                query
              </p>
              <div className="list-box">
                <div className="list">
                  {segment?.map((data, i) => (
                    <div key={i}>
                      <Select
                        onChange={(value) => onSelectionChange(value, data, i)}
                        options={options}
                        defaultValue={options.filter(
                          (option) =>
                            option.label === Object.values(data)[0] ?? null
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                value={options.filter(
                  (option) => option.label === selectedOption?.label
                )}
              />
              <button className="btn-add" onClick={addNewSegment}>
                +Add new segment
              </button>
            </div>
            <div className="modal-footer">
              <button className="btn-save" onClick={onSubmit}>
                Save the segment
              </button>
              <button className="btn-cancel" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>


        
      </div>
    </div>
  );
}
