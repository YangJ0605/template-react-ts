import React, { useRef, useState, useCallback } from 'react'

import { Input, Space, Button } from 'antd'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import Highlighter from 'react-highlight-words'

// type HandleSearch = (selectedKeys: string[], confirm: Function, dataIndex: string) => void
// type HandleReset = (clearFilters:Function) => void

export const useGetColumnSearchPropsWrapper = () => {
  const inputRef = useRef<Input>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [searchedColumn, setSearchedColumn] = useState<string>('')

  const handleSearch = useCallback((selectedKeys: string[], confirm: Function, dataIndex: string) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }, [])
  const handleReset = useCallback((clearFilters: Function) => {
    clearFilters()
    setSearchText('')
  }, [])
  return (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: { setSelectedKeys: Function; selectedKeys: string[]; confirm: Function; clearFilters: Function }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={inputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type='primary' onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size='small' style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => {
      return <SearchOutlined style={{ color: filtered ? 'red' : undefined }} />
    },
    onFilter: (value: string, record: any) => (record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : ''),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => inputRef.current?.select(), 100)
      }
    },
    render: (text: string) => (searchedColumn === dataIndex ? <Highlighter highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ''} /> : text),
  })
}
