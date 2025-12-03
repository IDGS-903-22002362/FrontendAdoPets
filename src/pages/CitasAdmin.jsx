import { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdClose,
  MdRefresh,
  MdSchedule,
  MdSearch,
} from "react-icons/md";
import useCitas from "../hooks/useCitas";
import { useServices } from "../hooks/useServices";
import useCitasDigitales from "../hooks/useCitasDigitales";
import { useAuth } from "../hooks/useAuth";
import useAdoptantes from "../hooks/useAdoptantes";
import useSalas from "../hooks/useSalas";

const statusStyles = {
  Programada: {
    label: "Programada",
    color: "bg-blue-50 text-blue-800 border border-blue-100",
  },
  EnProceso: {
    label: "En proceso",
    color: "bg-indigo-50 text-indigo-800 border border-indigo-100",
  },
  Completada: {
    label: "Completada",
    color: "bg-green-50 text-green-800 border border-green-100",
  },
  Cancelada: {
    label: "Cancelada",
    color: "bg-red-50 text-red-800 border border-red-100",
  },
  NoAsistio: {
    label: "No asistió",
    color: "bg-gray-100 text-gray-700 border border-gray-200",
  },
  Pendiente: {
    label: "Pendiente",
    color: "bg-amber-50 text-amber-800 border border-amber-100",
  },
};

const digitalStatusStyles = {
  Pendiente: {
    label: "Pendiente",
    color: "bg-amber-50 text-amber-800 border border-amber-200",
  },
  EnRevision: {
    label: "En revisión",
    color: "bg-blue-50 text-blue-800 border border-blue-200",
  },
  PendientePago: {
    label: "Pendiente pago",
    color: "bg-yellow-50 text-yellow-800 border border-yellow-200",
  },
  PagadaPendienteConfirmacion: {
    label: "Pago recibido",
    color: "bg-teal-50 text-teal-800 border border-teal-200",
  },
  Confirmada: {
    label: "Confirmada",
    color: "bg-green-50 text-green-800 border border-green-200",
  },
  Rechazada: {
    label: "Rechazada",
    color: "bg-red-50 text-red-800 border border-red-200",
  },
  Cancelada: {
    label: "Cancelada",
    color: "bg-gray-100 text-gray-700 border border-gray-200",
  },
  Expirada: {
    label: "Expirada",
    color: "bg-orange-50 text-orange-800 border border-orange-200",
  },
};
const tipoLabels = {
  Consulta: "Consulta",
  Cirugia: "Cirugía",
  Bano: "Baño",
  Vacuna: "Vacunación",
  Procedimiento: "Procedimiento",
  Urgencia: "Urgencia",
  Seguimiento: "Seguimiento",
  Vacunacion: "Vacunación",
  Emergencia: "Emergencia",
};

const tipoKeyFromValue = (value) => {
  if (!value) return "Consulta";
  if (typeof value === "string") return value;
  const map = {
    1: "Consulta",
    2: "Vacunacion",
    3: "Procedimiento",
    4: "Cirugia",
    5: "Emergencia",
  };
  return map[value] || "Consulta";
};

const tipoValueForApi = (value) => {
  if (typeof value === "number") return value;
  const map = {
    Consulta: 1,
    Vacunacion: 2,
    Procedimiento: 3,
    Cirugia: 4,
    Emergencia: 5,
  };
  return map[value] || 1;
};

const isGuidLike = (value) =>
  typeof value === "string" &&
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    value
  );

// Normaliza un GUID eliminando caracteres extra y validando formato
const normalizeGuid = (value) => {
  if (!value || typeof value !== "string") return "";

  // Eliminar espacios y caracteres no hexadecimales excepto guiones
  let cleaned = value.trim().replace(/[^0-9a-fA-F-]/g, "");

  // Si tiene más de 36 caracteres, extraer solo los necesarios
  if (cleaned.length > 36) {
    // Intentar extraer un GUID válido del string
    const guidMatch = cleaned.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
    );
    if (guidMatch) {
      cleaned = guidMatch[0];
    } else {
      // Si no hay un patrón válido, truncar a 36 caracteres
      cleaned = cleaned.substring(0, 36);
    }
  }

  // Validar que sea un GUID correcto
  if (isGuidLike(cleaned)) {
    return cleaned;
  }

  console.warn(
    "⚠️ GUID inválido después de normalizar:",
    value,
    "→",
    cleaned,
    `(${cleaned.length} caracteres)`
  );
  return cleaned;
};

const normalizeDateTimeLocal = (value) => {
  if (!value) return null;
  let str = `${value}`.replace("Z", "");
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) {
    str = `${str}:00`;
  }
  return str;
};

const statusKeyFromValue = (value) => {
  if (!value && value !== 0) return "Pendiente";
  if (typeof value === "string") return value;
  const map = {
    0: "Pendiente",
    1: "Programada",
    2: "EnProceso",
    3: "Completada",
    4: "Cancelada",
    5: "NoAsistio",
  };
  return map[value] || "Pendiente";
};

const digitalStatusKeyFromValue = (value) => {
  if (!value && value !== 0) return "Pendiente";
  if (typeof value === "string") return value;
  const map = {
    1: "Pendiente",
    2: "EnRevision",
    3: "PendientePago",
    4: "PagadaPendienteConfirmacion",
    5: "Confirmada",
    6: "Rechazada",
    7: "Cancelada",
    8: "Expirada",
  };
  return map[value] || "Pendiente";
};

const initialForm = {
  mascotaId: "",
  propietarioId: "",
  veterinarioId: "",
  salaId: "",
  tipo: "Consulta",
  startAt: "",
  duracionMin: 30,
  motivoConsulta: "",
  notas: "",
};

const formatDateTime = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toInputDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const CitasAdmin = () => {
  const { getEmpleados } = useServices();
  const {
    citas,
    loading,
    error,
    fetchCitas,
    createCita,
    updateCita,
    cancelCita,
    completarCita,
    deleteCita,
    checkDisponibilidad,
  } = useCitas();
  const {
    solicitudes,
    loading: loadingSolicitudes,
    error: errorSolicitudes,
    fetchPendientes,
    marcarEnRevision,
    verificarDisponibilidad: verificarSolicitudDigital,
    confirmarSolicitud,
    rechazarSolicitud,
  } = useCitasDigitales();
  const {
    adoptantes,
    loading: loadingAdoptantes,
    fetchAdoptantes,
  } = useAdoptantes();
  const { salas, fetchSalas } = useSalas();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    veterinarioId: "",
  });
  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [notification, setNotification] = useState(null);
  const [veterinarios, setVeterinarios] = useState([]);
  const [verificacionDigital, setVerificacionDigital] = useState(null);
  const [showSolicitudesModal, setShowSolicitudesModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [confirmDigitalForm, setConfirmDigitalForm] = useState({
    veterinarioId: "",
    salaId: "",
    fechaHoraConfirmada: "",
    duracionMin: 60,
  });
  const [citaActionReason, setCitaActionReason] = useState("");
  const [solicitudMotivo, setSolicitudMotivo] = useState("");
  const [selectedAdoptante, setSelectedAdoptante] = useState(null);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [adoptanteQuery, setAdoptanteQuery] = useState("");

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  useEffect(() => {
    fetchPendientes();
  }, [fetchPendientes]);

  useEffect(() => {
    fetchAdoptantes();
  }, [fetchAdoptantes]);

  useEffect(() => {
    fetchSalas();
  }, [fetchSalas]);

  useEffect(() => {
    const cargarVeterinarios = async () => {
      const res = await getEmpleados({ pageNumber: 1, pageSize: 100 });
      if (res?.success) {
        const vets =
          res.data?.items?.filter(
            (emp) =>
              emp.roles?.includes("Veterinario") ||
              emp.tipoEmpleado?.toLowerCase().includes("veter")
          ) || [];

        // Debug: verificar IDs de veterinarios
        console.log(
          "🔍 Veterinarios cargados:",
          res.data?.items?.length,
          "empleados totales"
        );
        console.log("🔍 Veterinarios filtrados:", vets.length);

        // IMPORTANTE: El backend ahora devuelve usuarioId en la respuesta de empleados
        // Usamos vet.usuarioId (ID del usuario) para las citas
        console.table(
          vets.map((v) => ({
            nombre: v.nombreCompleto || v.nombre,
            empleadoId: v.id,
            usuarioId: v.usuarioId,
            "usuarioId válido": isGuidLike(v.usuarioId),
            "✅ Se usará": "usuarioId",
          }))
        );

        setVeterinarios(vets);
      }
    };
    cargarVeterinarios();
  }, [getEmpleados]);

  const statusStats = useMemo(() => {
    return citas.reduce((acc, cita) => {
      const key = statusKeyFromValue(cita.status ?? cita.estado);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [citas]);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3200);
  };

  const filteredAdoptantes = adoptantes.filter((ad) =>
    (ad.nombreCompleto || "")
      .toLowerCase()
      .includes(adoptanteQuery.toLowerCase())
  );

  const salaOptions =
    salas
      ?.map((s) => ({
        id: s.id || s.salaId,
        label: s.nombre || s.id || s.salaId,
      }))
      .filter((s) => !!s.id) || [];

  const handleFilter = async () => {
    const result = await fetchCitas(filters);
    if (!result.success) {
      showToast("error", result.message || "No se pudieron cargar las citas");
    }
  };

  const handleResetFilters = async () => {
    const clean = { status: "", startDate: "", endDate: "", veterinarioId: "" };
    setFilters(clean);
    await fetchCitas(clean);
  };

  const handleSolicitudRevision = async (solicitud) => {
    if (!solicitud) return;
    try {
      const result = await marcarEnRevision(solicitud.id, user?.id);
      if (result.success) {
        showToast("success", "Solicitud marcada en revisión");
        fetchPendientes();
      } else {
        showToast(
          "error",
          result.message || "No se pudo actualizar la solicitud"
        );
      }
    } catch (err) {
      showToast("error", "No se pudo actualizar la solicitud");
    }
  };

  const handleVerificarSolicitud = async (solicitud) => {
    if (!solicitud) return;
    const payload = {
      fechaHoraInicio: solicitud.fechaHoraSolicitada,
      duracionMin: solicitud.duracionEstimadaMin || 60,
      veterinarioId:
        confirmDigitalForm.veterinarioId ||
        solicitud.veterinarioPreferidoId ||
        "",
      salaId:
        (isGuidLike(confirmDigitalForm.salaId) && confirmDigitalForm.salaId) ||
        (isGuidLike(solicitud.salaId) && solicitud.salaId) ||
        undefined,
    };
    try {
      const result = await verificarSolicitudDigital(payload);
      if (result.success) {
        const data = result.data || {};
        setVerificacionDigital({ solicitudId: solicitud.id, ...data });
        showToast("success", data.mensaje || "Disponibilidad consultada");
      } else {
        showToast("error", result.message || "No se pudo verificar");
      }
    } catch (err) {
      showToast("error", "No se pudo verificar");
    }
  };

  const handleAbrirConfirmacion = (solicitud) => {
    if (!solicitud) return;
    setConfirmDigitalForm({
      veterinarioId: solicitud.veterinarioPreferidoId || "",
      salaId: isGuidLike(solicitud.salaId) ? solicitud.salaId : "",
      fechaHoraConfirmada: solicitud.fechaHoraSolicitada
        ? toInputDateTime(solicitud.fechaHoraSolicitada)
        : "",
      duracionMin: solicitud.duracionEstimadaMin || 60,
    });
    setConfirmDigitalModal({ open: true, solicitud });
  };

  const handleConfirmSolicitud = async () => {
    if (!selectedSolicitud) return;
    const payload = {
      solicitudId: selectedSolicitud.id,
      confirmadoPorId: user?.id,
      veterinarioId: confirmDigitalForm.veterinarioId,
      salaId: isGuidLike(confirmDigitalForm.salaId)
        ? confirmDigitalForm.salaId
        : null,
      fechaHoraConfirmada: normalizeDateTimeLocal(
        confirmDigitalForm.fechaHoraConfirmada ||
          selectedSolicitud.fechaHoraSolicitada
      ),
      duracionMin: Number(confirmDigitalForm.duracionMin || 60),
    };
    try {
      const result = await confirmarSolicitud(payload);
      if (result.success) {
        showToast("success", "Solicitud confirmada y cita creada");
        setSelectedSolicitud(null);
        fetchPendientes();
        fetchCitas();
      } else {
        showToast(
          "error",
          result.message || "No se pudo confirmar la solicitud"
        );
      }
    } catch (err) {
      showToast("error", "No se pudo confirmar la solicitud");
    }
  };

  const handleRechazarSolicitud = async () => {
    if (!selectedSolicitud) return;
    const payload = {
      solicitudId: selectedSolicitud.id,
      rechazadoPorId: user?.id,
      motivo: solicitudMotivo,
    };
    try {
      const result = await rechazarSolicitud(payload);
      if (result.success) {
        showToast("success", "Solicitud rechazada");
        setSelectedSolicitud(null);
        setSolicitudMotivo("");
        fetchPendientes();
      } else {
        showToast(
          "error",
          result.message || "No se pudo rechazar la solicitud"
        );
      }
    } catch (err) {
      showToast("error", "No se pudo rechazar la solicitud");
    }
  };

  const handleOpenForm = (cita = null) => {
    if (cita) {
      setEditingCita(cita);
      const adoptante = adoptantes.find(
        (a) => a.usuarioId === cita.propietarioId
      );
      if (adoptante) {
        handleSelectAdoptante(adoptante);
      } else {
        setSelectedAdoptante(null);
        setSelectedMascota(null);
        setAdoptanteQuery("");
      }
      setFormData({
        mascotaId: cita.mascotaId || "",
        propietarioId: cita.propietarioId || "",
        veterinarioId: cita.veterinarioId || "",
        salaId: cita.salaId || "",
        tipo: tipoKeyFromValue(cita.tipo),
        startAt: toInputDateTime(cita.startAt),
        duracionMin: cita.duracionMin || 30,
        motivoConsulta: cita.motivoConsulta || "",
        notas: cita.notas || "",
      });
    } else {
      setEditingCita(null);
      setFormData(initialForm);
    }
    setAvailability(null);
    setShowForm(true);
  };

  const handleSaveCita = async () => {
    if (!formData.propietarioId || !formData.mascotaId) {
      showToast("error", "Selecciona un adoptante y una mascota");
      return;
    }
    if (!formData.veterinarioId) {
      showToast("error", "Selecciona un veterinario");
      return;
    }

    // Normalizar y validar IDs (eliminar caracteres extra)
    console.log("🔍 IDs antes de normalizar:", {
      propietarioId: formData.propietarioId,
      mascotaId: formData.mascotaId,
      veterinarioId: formData.veterinarioId,
      salaId: formData.salaId,
    });

    const cleanPropietarioId = normalizeGuid(formData.propietarioId);
    const cleanMascotaId = normalizeGuid(formData.mascotaId);
    const cleanVeterinarioId = normalizeGuid(formData.veterinarioId);
    const cleanSalaId = formData.salaId ? normalizeGuid(formData.salaId) : null;

    console.log("✅ IDs después de normalizar:", {
      propietarioId: cleanPropietarioId,
      mascotaId: cleanMascotaId,
      veterinarioId: cleanVeterinarioId,
      salaId: cleanSalaId,
    });

    // Validar formato de GUID para todos los IDs requeridos
    if (!isGuidLike(cleanPropietarioId)) {
      console.error(
        "❌ ID de propietario inválido:",
        cleanPropietarioId,
        "longitud:",
        cleanPropietarioId.length
      );
      showToast("error", "ID de propietario con formato inválido");
      return;
    }

    if (!isGuidLike(cleanMascotaId)) {
      console.error(
        "❌ ID de mascota inválido:",
        cleanMascotaId,
        "longitud:",
        cleanMascotaId.length
      );
      showToast("error", "ID de mascota con formato inválido");
      return;
    }

    if (!isGuidLike(cleanVeterinarioId)) {
      console.error(
        "❌ ID de veterinario inválido:",
        cleanVeterinarioId,
        "longitud:",
        cleanVeterinarioId.length
      );
      showToast("error", "ID de veterinario con formato inválido");
      return;
    }

    if (cleanSalaId && !isGuidLike(cleanSalaId)) {
      console.error(
        "❌ ID de sala inválido:",
        cleanSalaId,
        "longitud:",
        cleanSalaId.length
      );
      showToast("error", "ID de sala con formato inválido");
      return;
    }

    const payload = {
      ...formData,
      tipo: tipoValueForApi(formData.tipo),
      duracionMin: Number(formData.duracionMin),
      startAt: normalizeDateTimeLocal(formData.startAt),
      propietarioId: cleanPropietarioId,
      mascotaId: cleanMascotaId,
      veterinarioId: cleanVeterinarioId,
      salaId: cleanSalaId && isGuidLike(cleanSalaId) ? cleanSalaId : null,
    };

    console.log("📤 Payload a enviar:", JSON.stringify(payload, null, 2));

    const action = editingCita
      ? await updateCita(editingCita.id, payload)
      : await createCita(payload);

    if (action.success) {
      showToast("success", editingCita ? "Cita actualizada" : "Cita creada");
      setShowForm(false);
      setEditingCita(null);
      setFormData(initialForm);
    } else {
      showToast("error", action.message || "No fue posible guardar la cita");
    }
  };

  const handleCheckAvailability = async () => {
    if (!formData.veterinarioId || !formData.startAt) {
      showToast("error", "Selecciona veterinario y fecha antes de validar");
      return;
    }
    const fecha = formData.startAt.split("T")[0];
    const result = await checkDisponibilidad({
      veterinarioId: formData.veterinarioId,
      fecha,
      salaId: formData.salaId || undefined,
    });
    if (result.success) {
      setAvailability(result.data);
      showToast("success", "Disponibilidad consultada");
    } else {
      showToast("error", result.message || "No se pudo verificar");
    }
  };

  const handleSelectCita = (cita) => {
    setSelectedCita(cita);
    setCitaActionReason("");
  };

  const handleSelectAdoptante = (adoptante) => {
    setSelectedAdoptante(adoptante);
    setAdoptanteQuery(adoptante?.nombreCompleto || "");

    // Normalizar propietarioId
    const propietarioId = normalizeGuid(adoptante?.usuarioId);
    setFormData((prev) => ({
      ...prev,
      propietarioId,
    }));

    const firstPet = adoptante?.mascotas?.[0];
    if (firstPet) {
      setSelectedMascota(firstPet);

      // Normalizar mascotaId
      const mascotaId = normalizeGuid(firstPet.mascotaId);
      console.log(
        "🐾 Mascota seleccionada:",
        firstPet.nombre,
        "ID normalizado:",
        mascotaId,
        `(${mascotaId.length} chars)`
      );

      setFormData((prev) => ({ ...prev, mascotaId }));
    } else {
      setSelectedMascota(null);
      setFormData((prev) => ({ ...prev, mascotaId: "" }));
    }
  };

  const handleSelectMascota = (mascota) => {
    setSelectedMascota(mascota);

    // Normalizar mascotaId
    const mascotaId = normalizeGuid(mascota?.mascotaId);
    console.log(
      "🐾 Mascota cambiada:",
      mascota?.nombre,
      "ID normalizado:",
      mascotaId,
      `(${mascotaId.length} chars)`
    );

    setFormData((prev) => ({ ...prev, mascotaId }));
  };

  const handleCompletarCita = async () => {
    if (!selectedCita) return;
    try {
      const result = await completarCita(selectedCita.id, citaActionReason);
      if (result?.success) {
        showToast("success", "Cita completada");
        setSelectedCita(null);
        setCitaActionReason("");
        fetchCitas();
      } else {
        showToast("error", result?.message || "No se pudo completar la cita");
      }
    } catch (err) {
      showToast("error", "No se pudo completar la cita");
    }
  };

  const handleCancelarCita = async () => {
    if (!selectedCita) return;
    try {
      const result = await cancelCita(selectedCita.id, citaActionReason);
      if (result?.success) {
        showToast("success", "Cita cancelada");
        setSelectedCita(null);
        setCitaActionReason("");
        fetchCitas();
      } else {
        showToast("error", result?.message || "No se pudo cancelar la cita");
      }
    } catch (err) {
      showToast("error", "No se pudo cancelar la cita");
    }
  };

  const handleSelectSolicitud = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setSolicitudMotivo("");
    setVerificacionDigital(null);
    setConfirmDigitalForm({
      veterinarioId: solicitud?.veterinarioPreferidoId || "",
      salaId: isGuidLike(solicitud?.salaId) ? solicitud.salaId : "",
      fechaHoraConfirmada: solicitud?.fechaHoraSolicitada
        ? toInputDateTime(solicitud.fechaHoraSolicitada)
        : "",
      duracionMin: solicitud?.duracionEstimadaMin || 60,
    });
  };

  const resumenCards = [
    {
      label: "Pendientes",
      value: statusStats.Pendiente || 0,
      color: "bg-amber-50 text-amber-800",
    },
    {
      label: "Programadas",
      value: statusStats.Programada || 0,
      color: "bg-blue-50 text-blue-800",
    },
    {
      label: "En proceso",
      value: statusStats.EnProceso || 0,
      color: "bg-indigo-50 text-indigo-800",
    },
    {
      label: "Completadas",
      value: statusStats.Completada || 0,
      color: "bg-green-50 text-green-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Panel administrativo</p>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MdSchedule className="text-primary text-3xl" />
              Gestión de citas
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSolicitudesModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition"
            >
              Solicitudes
              <span className="min-w-6 px-2 py-1 text-xs font-semibold rounded-full bg-primary text-white text-center">
                {solicitudes.length}
              </span>
            </button>
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
            >
              <MdAdd />
              Nueva cita
            </button>
          </div>
        </div>

        {notification && (
          <div
            className={`border px-4 py-3 rounded-lg ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {resumenCards.map((card) => (
            <div
              key={card.label}
              className={`rounded-xl shadow-sm px-4 py-3 border border-gray-100 ${card.color}`}
            >
              <p className="text-sm text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <MdSearch />
            <span>Filtros</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-600">Estado</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="input-field"
              >
                <option value="">Todos</option>
                {Object.entries(statusStyles).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Veterinario</label>
              <select
                value={filters.veterinarioId}
                onChange={(e) =>
                  setFilters({ ...filters, veterinarioId: e.target.value })
                }
                className="input-field"
              >
                <option value="">Todos</option>
                {veterinarios.map((vet) => (
                  <option
                    key={vet.usuarioId || vet.id}
                    value={vet.usuarioId || vet.id}
                  >
                    {vet.nombreCompleto || vet.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Fecha inicio</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Fecha fin</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleFilter}
              className="btn-primary flex items-center gap-2"
              disabled={loading}
            >
              <MdSearch /> Aplicar
            </button>
            <button
              onClick={handleResetFilters}
              className="btn-secondary flex items-center gap-2"
              disabled={loading}
            >
              <MdRefresh /> Limpiar
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Citas programadas
              </h3>
              <p className="text-sm text-gray-500">
                Resumen de agenda y acciones r?pidas
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {loading ? "Actualizando..." : `${citas.length} registros`}
            </div>
          </div>

          {citas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay citas para mostrar con los filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propietario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veterinario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {citas.map((cita) => {
                    const statusKey = statusKeyFromValue(
                      cita.status ?? cita.estado
                    );
                    const statusInfo =
                      statusStyles[statusKey] || statusStyles.Pendiente;
                    const tipoKey = tipoKeyFromValue(cita.tipo);
                    return (
                      <tr
                        key={cita.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectCita(cita)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {cita.mascotaNombre || "Sin nombre"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Sala:{" "}
                            {cita.salaNombre || cita.salaId || "Sin asignar"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {cita.propietarioNombre || "Propietario"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {cita.propietarioEmail ||
                              cita.propietarioTelefono ||
                              ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {cita.veterinarioNombre || "Sin asignar"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(cita.startAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                            {tipoLabels[tipoKey] || "Otro"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start md:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl animate-scale-in border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500">
                  {editingCita
                    ? "Actualiza la informaci?n de la cita"
                    : "Registra una nueva cita"}
                </p>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingCita ? "Editar cita" : "Nueva cita"}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={22} />
              </button>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-sm text-gray-600">Adoptante</label>
                <input
                  type="text"
                  value={adoptanteQuery}
                  onChange={(e) => {
                    setAdoptanteQuery(e.target.value);
                    setSelectedAdoptante(null);
                    setSelectedMascota(null);
                    setFormData((prev) => ({
                      ...prev,
                      propietarioId: "",
                      mascotaId: "",
                    }));
                  }}
                  className="input-field"
                  placeholder="Busca adoptante"
                  autoComplete="off"
                />
                {adoptanteQuery && (
                  <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 w-full max-h-48 overflow-auto">
                    {filteredAdoptantes.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Sin resultados
                      </div>
                    ) : (
                      filteredAdoptantes.map((ad) => (
                        <button
                          key={ad.usuarioId}
                          type="button"
                          onClick={() => handleSelectAdoptante(ad)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                        >
                          <div className="font-semibold text-gray-800">
                            {ad.nombreCompleto}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ad.email} · {ad.telefono}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600">Mascota</label>
                <select
                  value={selectedMascota?.mascotaId || ""}
                  onChange={(e) => {
                    const pet = selectedAdoptante?.mascotas?.find(
                      (m) => m.mascotaId === e.target.value
                    );
                    handleSelectMascota(pet);
                  }}
                  className="input-field"
                  disabled={!selectedAdoptante}
                >
                  <option value="">Selecciona una mascota</option>
                  {selectedAdoptante?.mascotas?.map((m) => (
                    <option key={m.mascotaId} value={m.mascotaId}>
                      {m.nombre} · {m.raza || m.especie}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Veterinario</label>
                <select
                  value={formData.veterinarioId}
                  onChange={(e) => {
                    const veterinarioId = normalizeGuid(e.target.value);
                    console.log(
                      "👨‍⚕️ Veterinario seleccionado, ID normalizado:",
                      veterinarioId,
                      `(${veterinarioId.length} chars)`
                    );
                    setFormData({ ...formData, veterinarioId });
                  }}
                  className="input-field"
                >
                  <option value="">Selecciona</option>
                  {veterinarios.map((vet) => (
                    <option
                      key={vet.usuarioId || vet.id}
                      value={vet.usuarioId || vet.id}
                    >
                      {vet.nombreCompleto || vet.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Sala</label>
                <select
                  value={formData.salaId}
                  onChange={(e) => {
                    const salaId = e.target.value
                      ? normalizeGuid(e.target.value)
                      : "";
                    if (salaId) {
                      console.log(
                        "🏥 Sala seleccionada, ID normalizado:",
                        salaId,
                        `(${salaId.length} chars)`
                      );
                    }
                    setFormData({ ...formData, salaId });
                  }}
                  className="input-field"
                >
                  <option value="">Sin asignar</option>
                  {salaOptions.map((sala) => (
                    <option key={sala.id} value={sala.id}>
                      {sala.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value })
                  }
                  className="input-field"
                >
                  {Object.entries(tipoLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Inicio</label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) =>
                    setFormData({ ...formData, startAt: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Duraci?n (min)</label>
                <input
                  type="number"
                  min={15}
                  max={480}
                  value={formData.duracionMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duracionMin: Number(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Motivo</label>
                <input
                  type="text"
                  value={formData.motivoConsulta}
                  onChange={(e) =>
                    setFormData({ ...formData, motivoConsulta: e.target.value })
                  }
                  className="input-field"
                  placeholder="Motivo de consulta"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Notas</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) =>
                    setFormData({ ...formData, notas: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                  placeholder="Notas para el equipo"
                />
              </div>
            </div>

            <div className="px-6 pb-4 flex flex-wrap gap-3 items-center">
              <button
                onClick={handleCheckAvailability}
                className="btn-secondary flex items-center gap-2"
                type="button"
              >
                <MdSearch /> Verificar disponibilidad
              </button>
              <div className="flex-1" />
              <button
                onClick={() => setShowForm(false)}
                className="btn-secondary"
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCita}
                className="btn-primary"
                disabled={loading}
                type="button"
              >
                {editingCita ? "Actualizar" : "Crear cita"}
              </button>
            </div>

            {availability && (
              <div className="px-6 pb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-800">
                    Disponibilidad para{" "}
                    {availability.fecha || formData.startAt.split("T")[0]}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(availability.horariosDisponibles || []).map(
                      (slot, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            slot.disponible
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {slot.horaInicio} - {slot.horaFin}
                          {!slot.disponible && slot.motivo
                            ? ` ? ${slot.motivo}`
                            : ""}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedCita && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Detalle de cita</p>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedCita.mascotaNombre}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDateTime(selectedCita.startAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedCita(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold">Propietario</p>
                <p>{selectedCita.propietarioNombre || "--"}</p>
              </div>
              <div>
                <p className="font-semibold">Veterinario</p>
                <p>{selectedCita.veterinarioNombre || "--"}</p>
              </div>
              <div>
                <p className="font-semibold">Sala</p>
                <p>{selectedCita.salaNombre || selectedCita.salaId || "--"}</p>
              </div>
              <div>
                <p className="font-semibold">Tipo</p>
                <p>{tipoLabels[tipoKeyFromValue(selectedCita.tipo)] || "--"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold">Notas</p>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedCita.notas || "Sin notas"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Notas / Motivo</label>
              <textarea
                value={citaActionReason}
                onChange={(e) => setCitaActionReason(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Opcional"
              />
            </div>

            <div className="flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => handleOpenForm(selectedCita)}
                className="btn-secondary"
              >
                Editar
              </button>
              <button
                onClick={handleCompletarCita}
                className="btn-primary"
                disabled={loading}
              >
                Completar
              </button>
              <button
                onClick={handleCancelarCita}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar cita
              </button>
            </div>
          </div>
        </div>
      )}

      {showSolicitudesModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">
                  Solicitudes de citas digitales
                </p>
                <h3 className="text-xl font-bold text-gray-800">
                  Pendientes ({solicitudes.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowSolicitudesModal(false);
                  setSelectedSolicitud(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={22} />
              </button>
            </div>

            {errorSolicitudes && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
                {errorSolicitudes}
              </div>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitud
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitante
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mascota
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitudes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No hay solicitudes pendientes.
                      </td>
                    </tr>
                  ) : (
                    solicitudes.map((solicitud) => {
                      const estadoInfo =
                        digitalStatusStyles[
                          digitalStatusKeyFromValue(solicitud.estado)
                        ] || digitalStatusStyles.Pendiente;
                      return (
                        <tr
                          key={solicitud.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectSolicitud(solicitud)}
                        >
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {solicitud.numeroSolicitud || solicitud.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {solicitud.nombreSolicitante}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {solicitud.nombreMascota}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {formatDateTime(solicitud.fechaHoraSolicitada)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${estadoInfo.color}`}
                            >
                              {estadoInfo.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {selectedSolicitud && (
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      Detalle de solicitud
                    </p>
                    <h4 className="text-lg font-bold text-gray-800">
                      {selectedSolicitud.numeroSolicitud ||
                        selectedSolicitud.id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(selectedSolicitud.fechaHoraSolicitada)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSolicitud(null);
                      setVerificacionDigital(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MdClose size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">Solicitante</p>
                    <p>{selectedSolicitud.nombreSolicitante}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Mascota</p>
                    <p>{selectedSolicitud.nombreMascota}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Veterinario preferido</p>
                    <p>
                      {selectedSolicitud.nombreVeterinarioPreferido || "--"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Servicio</p>
                    <p>
                      {selectedSolicitud.descripcionServicio ||
                        selectedSolicitud.motivoConsulta ||
                        "--"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">
                      Veterinario asignado
                    </label>
                    <select
                      className="input-field"
                      value={confirmDigitalForm.veterinarioId}
                      onChange={(e) =>
                        setConfirmDigitalForm((prev) => ({
                          ...prev,
                          veterinarioId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecciona</option>
                      {veterinarios.map((vet) => (
                        <option
                          key={vet.usuarioId || vet.id}
                          value={vet.usuarioId || vet.id}
                        >
                          {vet.nombreCompleto || vet.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Sala</label>
                    <select
                      className="input-field"
                      value={confirmDigitalForm.salaId}
                      onChange={(e) =>
                        setConfirmDigitalForm((prev) => ({
                          ...prev,
                          salaId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Sin asignar</option>
                      {salaOptions.map((sala) => (
                        <option key={sala.id} value={sala.id}>
                          {sala.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Fecha confirmada
                    </label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={confirmDigitalForm.fechaHoraConfirmada}
                      onChange={(e) =>
                        setConfirmDigitalForm((prev) => ({
                          ...prev,
                          fechaHoraConfirmada: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Duraci?n (min)
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={480}
                      className="input-field"
                      value={confirmDigitalForm.duracionMin}
                      onChange={(e) =>
                        setConfirmDigitalForm((prev) => ({
                          ...prev,
                          duracionMin: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Motivo / notas
                  </label>
                  <textarea
                    className="input-field"
                    value={solicitudMotivo}
                    onChange={(e) => setSolicitudMotivo(e.target.value)}
                    rows={3}
                    placeholder="Opcional"
                  />
                </div>

                {verificacionDigital && (
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      verificacionDigital.disponible
                        ? "bg-green-50 text-green-800"
                        : "bg-yellow-50 text-yellow-800"
                    }`}
                  >
                    <p className="font-semibold">
                      {verificacionDigital.mensaje ||
                        "Resultado de disponibilidad"}
                    </p>
                    {Array.isArray(verificacionDigital.conflictos) &&
                      verificacionDigital.conflictos.length > 0 && (
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          {verificacionDigital.conflictos.map((conf, idx) => (
                            <li key={idx}>
                              {conf.tipo}: {formatDateTime(conf.horaInicio)} -{" "}
                              {formatDateTime(conf.horaFin)} ({conf.descripcion}
                              )
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={handleConfirmSolicitud}
                    className="btn-primary"
                    disabled={loadingSolicitudes}
                  >
                    Confirmar y crear cita
                  </button>
                  <button
                    onClick={handleRechazarSolicitud}
                    className="btn-secondary"
                    disabled={loadingSolicitudes}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitasAdmin;
