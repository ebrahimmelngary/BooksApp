import { AppColors } from '../../../../constant/AppColors';
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.secondary,
    padding: 16
   },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  author: { color: AppColors.gray, marginTop: 4 },
  input: {
    minHeight: 100,
    backgroundColor: AppColors.secondary,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: AppColors.gray,
  },
  marginTop: { marginTop: 16 },
  
  rowContainer: { flexDirection: 'row', marginTop: 8  },
});
