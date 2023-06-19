import React, { useEffect, useState } from 'react';
import { API_URL } from './global';
import { Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react';

type LogMessage = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  Message: string;
  UserID: number;
};

const LogList = () => {
  const [logs, setLogs] = useState<LogMessage[]>([]);

  const handleUpdateLogs = async () => {
    const res = await fetch(`${API_URL}/api/logs/`);
    const data = await res.json();
    setLogs(data.messages);
  };

  useEffect(() => {
    handleUpdateLogs();
  }, []);

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Td>ID</Td>
            <Td>Сообщение</Td>
            <Td>ID Пользователя</Td>
            <Td>Дата</Td>
          </Tr>
        </Thead>
        <Tbody>
          {logs.map((m) => (
            <Tr key={m.ID}>
              <Td>{m.ID}</Td>
              <Td>{m.Message}</Td>
              <Td>{m.UserID}</Td>
              <Td>{new Date(Date.parse(m.UpdatedAt)).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default LogList;
