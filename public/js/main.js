document.addEventListener('DOMContentLoaded', function() {
    loadEquipment();

    // Event listener untuk menambahkan peralatan baru
    document.getElementById('create-equipment-form').addEventListener('submit', createEquipment);
});

function loadEquipment() {
    fetch('/api/equipment')
        .then(response => response.json())
        .then(data => {
            const equipmentList = document.getElementById('equipment-list');
            equipmentList.innerHTML = '';
            data.forEach(item => {
                equipmentList.innerHTML += `
                    <div>
                        <p>ID: ${item.id}</p>
                        <p>Nama: ${item.name}</p>
                        <p>Tipe: ${item.type}</p>
                        <p>Jumlah: ${item.quantity}</p>
                        <button onclick="deleteEquipment(${item.id})">Hapus</button>
                        <!-- Anda bisa menambahkan tombol edit di sini -->
                    </div>
                    <hr/>
                `;
            });
        });
}

function createEquipment(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const quantity = document.getElementById('quantity').value;

    fetch('/api/equipment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name, type: type, quantity: quantity})
    })
    .then(response => response.json())
    .then(() => {
        // Reset form dan muat ulang daftar peralatan
        document.getElementById('create-equipment-form').reset();
        loadEquipment();
    });
}

function deleteEquipment(id) {
    fetch(`/api/equipment/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        loadEquipment();
    });
}
