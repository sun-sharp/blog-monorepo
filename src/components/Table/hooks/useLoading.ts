import { ref, unref, computed, watch, ExtractPropTypes } from 'vue';
import { BasicTableProps } from './useBasicTable';

export const useLoading = (props: ExtractPropTypes<typeof BasicTableProps>) => {
  const loadingRef = ref(unref(props).loading);

  watch(
    () => unref(props).loading,
    (loading) => {
      loadingRef.value = loading;
    }
  );

  const getLoading = computed(() => unref(loadingRef));

  const setLoading = (loading: boolean) => {
    loadingRef.value = loading;
  };

  return { getLoading, setLoading };
};
