import React, { useState } from 'react';
import styled from 'styled-components';

const Yongdammeuncontroltest = () => {
  const [currentTab, setCurrentTab] = useState('tab-1');

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
  };

  return (
    <>
      <Container>
        <MenuBar></MenuBar>
        <MenuContainer>
          <MenuTitle>사진 비교</MenuTitle>

          <Tabs>
            <TabLink 
              className={currentTab === 'tab-1' ? 'current' : ''} 
              onClick={() => handleTabClick('tab-1')}
            >
              위성사진
            </TabLink>
            <TabLink 
              className={currentTab === 'tab-2' ? 'current' : ''} 
              onClick={() => handleTabClick('tab-2')}
            >
              드론사진
            </TabLink>
           
          </Tabs>

          <TabContent className={currentTab === 'tab-1' ? 'current' : ''}>
            tab content1
          </TabContent>
          <TabContent className={currentTab === 'tab-2' ? 'current' : ''}>
            tab content2
          </TabContent>
          
        </MenuContainer>
      </Container>
    </>
  );
};

export default Yongdammeuncontroltest;

const Container = styled.div`
  width: max-content;
  height: 100vh;
  display: flex;
`;

const MenuBar = styled.div`
  width: 60px;
  height: 100%;
  background-color: white;
`;

const MenuContainer = styled.div`
  width: 300px;
  height: 100%;
  background-color: pink;
  padding: 13px;
`;

const MenuTitle = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  font-weight: 0.8;
  font-size: 20px;
  border-bottom: 2px solid gray;
`;

const Tabs = styled.ul`
  margin: 0px;
  padding: 0px;
  list-style: none;
  display: flex;
`;

const TabLink = styled.li`
  display:flex;
  align-items:center;
  justify-contents:center;
  width:50%;
  background: none;
  color: #222;
  padding: 10px 15px;
  cursor: pointer;
  &.current {
    background: #ededed;
    color: #222;
  }
`;

const TabContent = styled.div`
  display: none;
  background: #ededed;
  padding: 15px;
  margin-top: 10px;
  &.current {
    display: block;
  }
`;
