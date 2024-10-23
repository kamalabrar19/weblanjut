document.addEventListener('DOMContentLoaded', () => {
    const equipmentTable = document.getElementById('equipmentTable');
    const equipmentForm = document.getElementById('equipmentForm');
    const submitButton = equipmentForm.querySelector('button[type="submit"]');
    let editMode = false;
    let editId = null;

    // Function to fetch and display equipment data
    function loadEquipment() {
        fetch('/api/equipment')
            .then(response => response.json())
            .then(data => {
                equipmentTable.innerHTML = '';
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.type}</td>
                        <td>${item.quantity}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editEquipment(${item.id}, '${item.name}', '${item.type}', ${item.quantity})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteEquipment(${item.id})">Hapus</button>
                        </td>
                    `;
                    equipmentTable.appendChild(row);
                });
            });
    }

    // Function to add or update equipment
    equipmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const quantity = document.getElementById('quantity').value;

        if (editMode) {
            // Update existing equipment
            fetch(`/api/equipment/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, type, quantity })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadEquipment();
                equipmentForm.reset();
                // Reset edit mode
                editMode = false;
                editId = null;
                submitButton.textContent = 'Tambah';
            });
        } else {
            // Add new equipment
            fetch('/api/equipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, type, quantity })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadEquipment();
                equipmentForm.reset();
            });
        }
    });

    // Function to delete equipment
    window.deleteEquipment = function(id) {
        fetch(`/api/equipment/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadEquipment();
        });
    };

    // Function to populate form with existing data for editing
    window.editEquipment = function(id, name, type, quantity) {
        document.getElementById('name').value = name;
        document.getElementById('type').value = type;
        document.getElementById('quantity').value = quantity;

        // Set form to edit mode
        editMode = true;
        editId = id;
        submitButton.textContent = 'Update';  // Change button text to 'Update'
    };

    // Load equipment data on page load
    loadEquipment();
});
