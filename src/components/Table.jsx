import { Box, Pagination } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


const Table = ({ rows = [], columns, totalRecords, size, page = 0, colors, handlePageChange }) => {
  return (
    <Box
      height="72vh"
      sx={{
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} !important`,
        },
      }}
    >
      <DataGrid
        disableRowSelectionOnClick
        rows={rows}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={totalRecords}
        components={{ Toolbar: GridToolbar }}
        pageSize={size}
        page={page}
        onPageChange={(newPage) => {
          // console.log("Pagination Clicked - New Page:", newPage);
          handlePageChange(newPage);
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true, 
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        slots={{
          toolbar: GridToolbar,
          pagination: () => (
            <Box display="flex" justifyContent="center" p={2}>
              <Pagination
                count={Math.ceil(totalRecords / size)}
                page={page + 1}
                onChange={(_, newPage) => { handlePageChange(newPage - 1); }}
                variant="outlined"
                shape="rounded"
              />
            </Box>
          ),
        }}
      />
    </Box>
  );
};

export default Table;
