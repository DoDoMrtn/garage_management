import { useEffect, useState } from 'react';
import './VehiclesManager.css';
const baseURI = import.meta.env.VITE_API_BASE_URL;

const VehiclesManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    owner_id: '',
    status: 'available'
  });

  // Fetch vehicles and users
  useEffect(() => {
    fetchVehicles();
    fetchUsers();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(baseURI + 'api/vehicles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(baseURI + 'api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'owner_id' ? (value ? parseInt(value) : '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? baseURI + `api/vehicles/${editingId}`
        : baseURI + 'api/vehicles';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingId ? 'Véhicule modifié avec succès' : 'Véhicule ajouté avec succès');
        resetForm();
        fetchVehicles();
      } else {
        alert('Erreur lors de l\'opération');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      ...vehicle,
      owner_id: vehicle.owner_id || ''
    });
    setEditingId(vehicle.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        const response = await fetch(baseURI + `api/vehicles/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          alert('Véhicule supprimé avec succès');
          fetchVehicles();
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      license_plate: '',
      owner_id: '',
      status: 'available'
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="vehicles-manager">
      <h3>Gestion des véhicules</h3>
      
      <button 
        className="btn-add"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Annuler' : 'Ajouter un véhicule'}
      </button>

      {showForm && (
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Marque:</label>
            <input 
              type="text" 
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Modèle:</label>
            <input 
              type="text" 
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Année:</label>
            <input 
              type="number" 
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Plaque d'immatriculation:</label>
            <input 
              type="text" 
              name="license_plate"
              value={formData.license_plate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Propriétaire:</label>
            <select 
              name="owner_id"
              value={formData.owner_id}
              onChange={handleInputChange}
            >
              <option value="">-- Sélectionner un propriétaire --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Statut:</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="available">Disponible</option>
              <option value="repair">En réparation</option>
              <option value="sold">Vendu</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">
            {editingId ? 'Modifier' : 'Ajouter'}
          </button>
        </form>
      )}

      <div className="vehicles-list">
        {vehicles.length === 0 ? (
          <p>Aucun véhicule enregistré</p>
        ) : (
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Marque</th>
                <th>Modèle</th>
                <th>Année</th>
                <th>Plaque</th>
                <th>Propriétaire</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.license_plate}</td>
                  <td>{vehicle.owner_name || '-'}</td>
                  <td>
                    <span className={`status status-${vehicle.status}`}>
                      {vehicle.status === 'available' && 'Disponible'}
                      {vehicle.status === 'repair' && 'En réparation'}
                      {vehicle.status === 'sold' && 'Vendu'}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(vehicle)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VehiclesManager;
