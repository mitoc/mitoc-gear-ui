import Pagination from "react-bootstrap/Pagination";

export function TablePagination({
  page,
  setPage,
  nbPage,
}: {
  page: number;
  setPage: (p: number) => void;
  nbPage: number;
}) {
  const goToPage = (p: number) => () => setPage(p);

  return (
    <Pagination>
      <Pagination.Prev disabled={page === 1} onClick={goToPage(page - 1)} />
      {page > 1 && <Pagination.Item onClick={goToPage(1)}>1</Pagination.Item>}
      {page - 2 > 1 && <Pagination.Ellipsis onClick={goToPage(page - 2)} />}
      {page - 1 > 1 && (
        <Pagination.Item onClick={goToPage(page - 1)}>
          {page - 1}
        </Pagination.Item>
      )}
      <Pagination.Item active>{page}</Pagination.Item>
      {page + 1 < nbPage && (
        <Pagination.Item onClick={goToPage(page + 1)}>
          {page + 1}
        </Pagination.Item>
      )}

      {page + 2 < nbPage && (
        <Pagination.Ellipsis onClick={goToPage(page + 2)} />
      )}

      {page < nbPage && (
        <Pagination.Item onClick={goToPage(nbPage)}>{nbPage}</Pagination.Item>
      )}
      <Pagination.Next
        disabled={page === nbPage}
        onClick={goToPage(page + 1)}
      />
    </Pagination>
  );
}
