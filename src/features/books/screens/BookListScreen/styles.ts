import { AppColors } from '../../../../constant/AppColors';
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1,
     backgroundColor: AppColors.secondary,
      padding: 12,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  controls: { marginBottom: 12 },
  search: {
    backgroundColor: AppColors.lightGray,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortRow: { flexDirection: 'row' },
  sortBtn: { padding: 8, color: AppColors.gray },
  sortActive: { color: AppColors.primary, fontWeight: '700' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
});
