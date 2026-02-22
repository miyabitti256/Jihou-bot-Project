import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UsersSearchFormProps {
  initialSearch: string;
}

export default function UsersSearchForm({
  initialSearch,
}: UsersSearchFormProps) {
  return (
    <form action="/users" method="get" className="mb-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            name="search"
            placeholder="ユーザー名で検索..."
            defaultValue={initialSearch}
            className="pl-10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button type="submit" className="shrink-0">
          検索
        </Button>
      </div>
    </form>
  );
}
