import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UsersPaginationProps {
  totalPages: number;
  currentPage: number;
  searchQuery?: string;
}

export default function UsersPagination({
  totalPages,
  currentPage,
  searchQuery = "",
}: UsersPaginationProps) {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    params.set("page", String(page));
    return `/users?${params.toString()}`;
  };

  // ページネーションの表示ロジック (PC表示用)
  const renderPaginationItems = () => {
    const items = [];
    const siblingsCount = 2; // 現在のページの前後に表示するページ数

    // 前後のページを計算
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

    // 省略記号を表示するかどうか
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // 常に最初と最後のページを表示
    if (shouldShowLeftDots) {
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink href={getPageUrl(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>,
      );

      items.push(
        <PaginationItem key="ellipsis-left">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    } else {
      // 省略記号を表示しない場合でも、1ページ目は常に表示
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink href={getPageUrl(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // ループで中間ページを生成
    for (
      let page = Math.max(leftSiblingIndex, 2);
      page <= Math.min(rightSiblingIndex, totalPages - 1);
      page++
    ) {
      items.push(
        <PaginationItem key={`page-${page}`}>
          <PaginationLink
            href={getPageUrl(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // 最後のページを常に表示（ただし、totalPagesが1でない場合）
    if (totalPages > 1) {
      if (shouldShowRightDots) {
        items.push(
          <PaginationItem key="ellipsis-right">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            href={getPageUrl(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  // モバイル表示用のシンプルなページネーション
  const renderMobilePaginationItems = () => {
    const items = [];

    // 前のページが存在する場合は表示
    if (currentPage > 1) {
      items.push(
        <PaginationItem key="mobile-prev-page">
          <PaginationLink
            href={getPageUrl(currentPage - 1)}
            className="text-xs"
          >
            {currentPage - 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // 現在のページ
    items.push(
      <PaginationItem key="mobile-current-page">
        <PaginationLink
          href={getPageUrl(currentPage)}
          isActive
          className="text-xs"
        >
          {currentPage}
        </PaginationLink>
      </PaginationItem>,
    );

    // 次のページが存在する場合は表示
    if (currentPage < totalPages) {
      items.push(
        <PaginationItem key="mobile-next-page">
          <PaginationLink
            href={getPageUrl(currentPage + 1)}
            className="text-xs"
          >
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageUrl(Math.max(currentPage - 1, 1))}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* モバイル表示用のページネーション */}
        <div className="flex md:hidden items-center">
          {renderMobilePaginationItems()}
        </div>

        {/* PC表示用のページネーション */}
        <div className="hidden md:flex md:items-center">
          {renderPaginationItems()}
        </div>

        <PaginationItem>
          <PaginationNext
            href={getPageUrl(Math.min(currentPage + 1, totalPages))}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
