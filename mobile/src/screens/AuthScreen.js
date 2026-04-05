import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  {
    label: "User",
    value: "user",
    description: "Need roadside help",
    icon: "person-outline",
  },
  {
    label: "Mechanic",
    value: "mechanic",
    description: "Offer repair services",
    icon: "construct-outline",
  },
  {
    label: "Fuel Station",
    value: "fuelStation",
    description: "Deliver fuel nearby",
    icon: "flame-outline",
  },
  {
    label: "Charging",
    value: "chargingStation",
    description: "EV mobile charging",
    icon: "flash-outline",
  },
  {
    label: "Admin",
    value: "admin",
    description: "Platform management",
    icon: "shield-checkmark-outline",
  },
];

export default function AuthScreen() {
  const route = useRoute();
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    role: "user",
    name: "",
    stationName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
    mechanicType: "car",
    servicesOffered: "",
    experience: "",
    licenseNumber: "",
    openingHours: "",
    deliveryAvailable: true,
    deliveryRadius: "",
    deliveryCharges: "",
    minimumOrderQuantity: "",
    fuelType: "Petrol",
    fuelPrice: "",
    mobileChargingAvailable: true,
    serviceRadius: "",
    serviceCharges: "",
    estimatedResponseTime: "",
    vehicleType: "4-wheeler",
    connectorType: "CCS2",
    pricePerKwh: "",
  });

  const rolesForCurrentMode = useMemo(() => {
    return isRegisterMode
      ? ROLES.filter((role) => role.value !== "admin")
      : ROLES;
  }, [isRegisterMode]);

  useEffect(() => {
    if (route.params?.mode === "signup") {
      setIsRegisterMode(true);
    }
    if (route.params?.mode === "login") {
      setIsRegisterMode(false);
    }
  }, [route.params?.mode]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setMessage("");
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isRegisterMode) {
        const payload = {
          role: form.role,
          name: form.name,
          stationName: form.stationName,
          ownerName: form.ownerName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
        };

        if (form.role === "mechanic") {
          payload.mechanicType = form.mechanicType;
          payload.servicesOffered = form.servicesOffered
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          payload.experience = Number(form.experience) || 0;
          payload.licenseNumber = form.licenseNumber;
          payload.licenseCopy = "pending-upload";
          payload.location = {
            type: "Point",
            coordinates: [
              Number(form.longitude) || 77.5946,
              Number(form.latitude) || 12.9716,
            ],
          };
        }

        if (form.role === "fuelStation") {
          payload.stationName = form.stationName;
          payload.ownerName = form.ownerName || form.name;
          payload.fuelTypes = [
            {
              type: form.fuelType,
              price: Number(form.fuelPrice) || 0,
              available: true,
            },
          ];
          payload.openingHours = form.openingHours || "24 Hours";
          payload.deliveryAvailable = form.deliveryAvailable;
          payload.deliveryRadius = Number(form.deliveryRadius) || 5;
          payload.deliveryCharges = Number(form.deliveryCharges) || 50;
          payload.minimumOrderQuantity = Number(form.minimumOrderQuantity) || 5;
          payload.licenseNumber = form.licenseNumber;
          payload.licenseCopy = "pending-upload";
          payload.location = {
            type: "Point",
            coordinates: [
              Number(form.longitude) || 77.5946,
              Number(form.latitude) || 12.9716,
            ],
          };
        }

        if (form.role === "chargingStation") {
          payload.stationName = form.stationName;
          payload.ownerName = form.ownerName || form.name;
          payload.chargingTypes = [
            {
              vehicleType: form.vehicleType,
              connectorType: form.connectorType,
              pricePerKwh: Number(form.pricePerKwh) || 0,
              available: true,
            },
          ];
          payload.mobileChargingAvailable = form.mobileChargingAvailable;
          payload.serviceRadius = Number(form.serviceRadius) || 10;
          payload.serviceCharges = Number(form.serviceCharges) || 100;
          payload.estimatedResponseTime =
            Number(form.estimatedResponseTime) || 30;
          payload.licenseNumber = form.licenseNumber;
          payload.licenseCopy = "pending-upload";
          payload.location = {
            type: "Point",
            coordinates: [
              Number(form.longitude) || 77.5946,
              Number(form.latitude) || 12.9716,
            ],
          };
        }

        await register(payload);
        if (
          ["mechanic", "fuelStation", "chargingStation"].includes(form.role)
        ) {
          setMessage(
            "Registration submitted. Your account is pending admin approval.",
          );
        } else {
          setMessage("Registration successful. Please login.");
        }
        setIsRegisterMode(false);
      } else {
        await login({
          email: form.email,
          password: form.password,
          role: form.role,
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>OnRoad Mobile</Text>
        <Text style={styles.title}>
          {isRegisterMode ? "Create Account" : "Login"}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Choose Role</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roleRow}
          >
            {rolesForCurrentMode.map((role) => {
              const selected = form.role === role.value;
              return (
                <Pressable
                  key={role.value}
                  style={[styles.roleCard, selected && styles.roleCardActive]}
                  onPress={() => setField("role", role.value)}
                >
                  <Ionicons
                    name={role.icon}
                    size={20}
                    color={selected ? "#052a33" : "#9ad7ff"}
                  />
                  <Text
                    style={[
                      styles.roleTitle,
                      selected && styles.roleTitleActive,
                    ]}
                  >
                    {role.label}
                  </Text>
                  <Text
                    style={[
                      styles.roleDescription,
                      selected && styles.roleDescriptionActive,
                    ]}
                  >
                    {role.description}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {isRegisterMode ? (
          <>
            {form.role === "fuelStation" || form.role === "chargingStation" ? (
              <>
                <Field
                  label="Station Name"
                  value={form.stationName}
                  onChangeText={(value) => setField("stationName", value)}
                  placeholder="Station name"
                />
                <Field
                  label="Owner Name"
                  value={form.ownerName}
                  onChangeText={(value) => setField("ownerName", value)}
                  placeholder="Owner name"
                />
              </>
            ) : (
              <Field
                label="Name"
                value={form.name}
                onChangeText={(value) => setField("name", value)}
                placeholder="Your full name"
              />
            )}

            <Field
              label="Phone"
              value={form.phone}
              onChangeText={(value) => setField("phone", value)}
              placeholder="9876543210"
            />
            <Field
              label="Address"
              value={form.address}
              onChangeText={(value) => setField("address", value)}
              placeholder="Street, City"
            />

            {form.role === "mechanic" ? (
              <RoleCard title="Mechanic Details" icon="construct-outline">
                <PickerField
                  label="Mechanic Type"
                  value={form.mechanicType}
                  onChange={(value) => setField("mechanicType", value)}
                  options={[
                    { label: "Car", value: "car" },
                    { label: "Bus/Truck", value: "bus_truck" },
                    { label: "Bike", value: "bike" },
                  ]}
                />
                <Field
                  label="Services (comma separated)"
                  value={form.servicesOffered}
                  onChangeText={(value) => setField("servicesOffered", value)}
                  placeholder="Flat tyre, Battery, Engine"
                />
                <Field
                  label="Experience (years)"
                  value={form.experience}
                  onChangeText={(value) => setField("experience", value)}
                  placeholder="5"
                  keyboardType="numeric"
                />
                <Field
                  label="License Number"
                  value={form.licenseNumber}
                  onChangeText={(value) => setField("licenseNumber", value)}
                  placeholder="LIC-12345"
                />
                <LatLngFields form={form} setField={setField} />
              </RoleCard>
            ) : null}

            {form.role === "fuelStation" ? (
              <RoleCard title="Fuel Station Details" icon="flame-outline">
                <Field
                  label="License Number"
                  value={form.licenseNumber}
                  onChangeText={(value) => setField("licenseNumber", value)}
                  placeholder="FUEL-LIC-001"
                />
                <Field
                  label="Opening Hours"
                  value={form.openingHours}
                  onChangeText={(value) => setField("openingHours", value)}
                  placeholder="6:00 AM - 10:00 PM"
                />
                <PickerField
                  label="Fuel Type"
                  value={form.fuelType}
                  onChange={(value) => setField("fuelType", value)}
                  options={[
                    { label: "Petrol", value: "Petrol" },
                    { label: "Diesel", value: "Diesel" },
                    { label: "CNG", value: "CNG" },
                  ]}
                />
                <Field
                  label="Fuel Price"
                  value={form.fuelPrice}
                  onChangeText={(value) => setField("fuelPrice", value)}
                  placeholder="102"
                  keyboardType="numeric"
                />
                <ToggleField
                  label="Delivery Available"
                  value={form.deliveryAvailable}
                  onChange={(value) => setField("deliveryAvailable", value)}
                />
                <Field
                  label="Delivery Radius (km)"
                  value={form.deliveryRadius}
                  onChangeText={(value) => setField("deliveryRadius", value)}
                  placeholder="5"
                  keyboardType="numeric"
                />
                <Field
                  label="Delivery Charges"
                  value={form.deliveryCharges}
                  onChangeText={(value) => setField("deliveryCharges", value)}
                  placeholder="50"
                  keyboardType="numeric"
                />
                <Field
                  label="Minimum Order (liters)"
                  value={form.minimumOrderQuantity}
                  onChangeText={(value) =>
                    setField("minimumOrderQuantity", value)
                  }
                  placeholder="5"
                  keyboardType="numeric"
                />
                <LatLngFields form={form} setField={setField} />
              </RoleCard>
            ) : null}

            {form.role === "chargingStation" ? (
              <RoleCard title="Charging Station Details" icon="flash-outline">
                <Field
                  label="License Number"
                  value={form.licenseNumber}
                  onChangeText={(value) => setField("licenseNumber", value)}
                  placeholder="EV-LIC-001"
                />
                <PickerField
                  label="Vehicle Type"
                  value={form.vehicleType}
                  onChange={(value) => setField("vehicleType", value)}
                  options={[
                    { label: "2-wheeler", value: "2-wheeler" },
                    { label: "3-wheeler", value: "3-wheeler" },
                    { label: "4-wheeler", value: "4-wheeler" },
                    { label: "commercial", value: "commercial" },
                  ]}
                />
                <PickerField
                  label="Connector Type"
                  value={form.connectorType}
                  onChange={(value) => setField("connectorType", value)}
                  options={[
                    { label: "Type2", value: "Type2" },
                    { label: "CCS2", value: "CCS2" },
                    { label: "CHAdeMO", value: "CHAdeMO" },
                    { label: "GBT", value: "GBT" },
                  ]}
                />
                <Field
                  label="Price per kWh"
                  value={form.pricePerKwh}
                  onChangeText={(value) => setField("pricePerKwh", value)}
                  placeholder="16"
                  keyboardType="numeric"
                />
                <ToggleField
                  label="Mobile Charging Available"
                  value={form.mobileChargingAvailable}
                  onChange={(value) =>
                    setField("mobileChargingAvailable", value)
                  }
                />
                <Field
                  label="Service Radius (km)"
                  value={form.serviceRadius}
                  onChangeText={(value) => setField("serviceRadius", value)}
                  placeholder="10"
                  keyboardType="numeric"
                />
                <Field
                  label="Service Charges"
                  value={form.serviceCharges}
                  onChangeText={(value) => setField("serviceCharges", value)}
                  placeholder="100"
                  keyboardType="numeric"
                />
                <Field
                  label="Estimated Response Time (minutes)"
                  value={form.estimatedResponseTime}
                  onChangeText={(value) =>
                    setField("estimatedResponseTime", value)
                  }
                  placeholder="30"
                  keyboardType="numeric"
                />
                <LatLngFields form={form} setField={setField} />
              </RoleCard>
            ) : null}
          </>
        ) : null}

        <Field
          label="Email"
          value={form.email}
          onChangeText={(value) => setField("email", value)}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Field
          label="Password"
          value={form.password}
          onChangeText={(value) => setField("password", value)}
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={loading ? null : submit}
        >
          {loading ? (
            <ActivityIndicator color="#062f3d" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isRegisterMode ? "Create Account" : "Login"}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            setIsRegisterMode((prev) => !prev);
            setError("");
            setMessage("");
          }}
        >
          <Text style={styles.switchText}>
            {isRegisterMode
              ? "Already have an account? Login"
              : "No account? Register"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, secureTextEntry, multiline, editable, ...props }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#6b7680"
        secureTextEntry={secureTextEntry === true}
        multiline={multiline === true}
        editable={editable !== false}
        {...props}
      />
    </View>
  );
}

function PickerField({ label, value, onChange, options }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          dropdownIconColor="#9ad7ff"
          style={styles.picker}
        >
          {options.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={Boolean(value)}
        onValueChange={onChange}
        trackColor={{ false: "#3a5a69", true: "#35d0ff" }}
        thumbColor={value ? "#ffffff" : "#9eb2be"}
      />
    </View>
  );
}

function RoleCard({ title, icon, children }) {
  return (
    <View style={styles.roleDetailCard}>
      <View style={styles.roleDetailHead}>
        <Ionicons name={icon} size={18} color="#35d0ff" />
        <Text style={styles.roleDetailTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function LatLngFields({ form, setField }) {
  return (
    <>
      <Field
        label="Latitude"
        value={form.latitude}
        onChangeText={(value) => setField("latitude", value)}
        placeholder="12.9716"
        keyboardType="numeric"
      />
      <Field
        label="Longitude"
        value={form.longitude}
        onChangeText={(value) => setField("longitude", value)}
        placeholder="77.5946"
        keyboardType="numeric"
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#0a1014" },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  brand: {
    color: "#9ad7ff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    color: "#f3f8fb",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 12,
  },
  modeSwitchWrap: {
    flexDirection: "row",
    backgroundColor: "#101920",
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#223542",
  },
  modeButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#35d0ff",
  },
  modeText: { color: "#9ad7ff", fontWeight: "700" },
  modeTextActive: { color: "#062f3d" },
  roleRow: { gap: 8 },
  roleCard: {
    width: 132,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#223542",
    backgroundColor: "#111b21",
    padding: 10,
    gap: 5,
  },
  roleCardActive: {
    borderColor: "#35d0ff",
    backgroundColor: "#35d0ff",
  },
  roleTitle: { color: "#e8f0f5", fontWeight: "700", fontSize: 13 },
  roleTitleActive: { color: "#052a33" },
  roleDescription: { color: "#8ea5b5", fontSize: 11 },
  roleDescriptionActive: { color: "#154f5e" },
  roleDetailCard: {
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1f2f38",
    borderRadius: 12,
    backgroundColor: "#0f171d",
    padding: 10,
  },
  roleDetailHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  roleDetailTitle: { color: "#d8edf8", fontWeight: "700", fontSize: 14 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldBlock: { marginBottom: 12 },
  label: { color: "#b6c5cf", marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: "#111b21",
    borderColor: "#223542",
    borderWidth: 1,
    borderRadius: 12,
    color: "#e8f0f5",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  pickerWrap: {
    backgroundColor: "#111b21",
    borderColor: "#223542",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: { color: "#e8f0f5" },
  primaryButton: {
    backgroundColor: "#35d0ff",
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#062f3d",
    fontWeight: "700",
    fontSize: 16,
  },
  switchText: {
    color: "#9ad7ff",
    textAlign: "center",
    fontWeight: "600",
  },
  error: {
    color: "#ff8f8f",
    backgroundColor: "#3f1f25",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  message: {
    color: "#9df7d1",
    backgroundColor: "#153a2e",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
