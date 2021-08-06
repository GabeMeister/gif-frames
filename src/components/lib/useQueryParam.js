import useQuery from "./useQuery";

export default function useQueryParam(name) {
  let query = useQuery();
  return query.get(name);
}