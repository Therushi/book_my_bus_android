import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Modal, ScrollView} from 'react-native';
import {Colors, Fonts, Spacing, Radii, Shadows} from '@/theme/theme';
import AppButton from '@/components/AppButton';
import FormInput from '@/components/FormInput';
import {RouteRepository} from '@/database/repositories/RouteRepository';
import {Route} from '@/models/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

const ManageRoutes: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editRoute, setEditRoute] = useState<Route | null>(null);
  const [form, setForm] = useState({source: '', destination: '', stops: '', distance_km: ''});

  const load = useCallback(async () => { setRoutes(await RouteRepository.getAll()); }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const openAdd = () => {
    setEditRoute(null);
    setForm({source: '', destination: '', stops: '', distance_km: ''});
    setModalVisible(true);
  };

  const openEdit = (r: Route) => {
    setEditRoute(r);
    const stopsArr = r.stops ? JSON.parse(r.stops) : [];
    setForm({source: r.source, destination: r.destination, stops: stopsArr.join(', '), distance_km: String(r.distance_km || '')});
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.source || !form.destination) { Alert.alert('Error', 'Source & destination required'); return; }
    const stopsJson = form.stops ? JSON.stringify(form.stops.split(',').map(s => s.trim()).filter(Boolean)) : null;
    try {
      if (editRoute) {
        await RouteRepository.update(editRoute.id, {source: form.source, destination: form.destination, stops: stopsJson ?? undefined, distance_km: parseFloat(form.distance_km) || undefined});
      } else {
        await RouteRepository.create({source: form.source, destination: form.destination, stops: stopsJson ?? undefined, distance_km: parseFloat(form.distance_km) || undefined});
      }
      setModalVisible(false);
      load();
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const handleDelete = (r: Route) => {
    Alert.alert('Delete Route', `Delete ${r.source} → ${r.destination}?`, [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: async () => { await RouteRepository.delete(r.id); load(); }},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Routes</Text>
        <AppButton title="Add Route" onPress={openAdd} icon={<Icon name="plus" size={18} color={Colors.white} />} style={styles.addBtn} />
      </View>
      <FlatList
        data={routes}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Icon name="map-marker-path" size={20} color={Colors.primary} />
              <View style={{flex: 1}}>
                <Text style={styles.routeText}>{item.source} → {item.destination}</Text>
                {item.stops && <Text style={styles.stops}>via {JSON.parse(item.stops).join(', ')}</Text>}
                {item.distance_km ? <Text style={styles.dist}>{item.distance_km} km</Text> : null}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEdit(item)}><Icon name="pencil" size={18} color={Colors.primary} /></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}><Icon name="delete" size={18} color={Colors.error} /></TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No routes yet</Text>}
      />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ScrollView>
              <Text style={styles.modalTitle}>{editRoute ? 'Edit Route' : 'Add Route'}</Text>
              <FormInput label="Source" value={form.source} onChangeText={v => setForm(f => ({...f, source: v}))} placeholder="e.g. Mumbai" />
              <FormInput label="Destination" value={form.destination} onChangeText={v => setForm(f => ({...f, destination: v}))} placeholder="e.g. Pune" />
              <FormInput label="Intermediate Stops (comma separated)" value={form.stops} onChangeText={v => setForm(f => ({...f, stops: v}))} placeholder="e.g. Lonavala, Khandala" />
              <FormInput label="Distance (km)" value={form.distance_km} onChangeText={v => setForm(f => ({...f, distance_km: v}))} keyboardType="numeric" placeholder="150" />
              <View style={styles.modalActions}>
                <AppButton title="Cancel" variant="outline" onPress={() => setModalVisible(false)} style={{flex: 1}} />
                <AppButton title="Save" onPress={handleSave} style={{flex: 1}} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.xl, paddingBottom: 0},
  title: {
    color: Colors.primaryDark,
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.extraBold,
    letterSpacing: -0.5,
  },
  addBtn: {paddingHorizontal: Spacing.base, height: 42, borderRadius: Radii.lg},
  list: {padding: Spacing.xl, paddingBottom: Spacing.huge},
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardRow: {flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start'},
  routeText: {color: Colors.textPrimary, fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold},
  stops: {color: Colors.textSecondary, fontSize: Fonts.sizes.md, marginTop: Spacing.xs, fontWeight: Fonts.weights.medium},
  dist: {color: Colors.textMuted, fontSize: Fonts.sizes.sm, marginTop: 4},
  actions: {flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md, marginTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.surfaceLight, paddingTop: Spacing.md},
  empty: {color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xxl, fontSize: Fonts.sizes.md, fontStyle: 'italic'},
  modalOverlay: {flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end'},
  modal: {backgroundColor: Colors.surface, borderTopLeftRadius: Radii.xl, borderTopRightRadius: Radii.xl, padding: Spacing.xl, maxHeight: '85%'},
  modalTitle: {color: Colors.primaryDark, fontSize: Fonts.sizes.xxl, fontWeight: Fonts.weights.extraBold, marginBottom: Spacing.xl, letterSpacing: -0.5},
  modalActions: {flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, paddingBottom: Spacing.xl},
});

export default ManageRoutes;
