import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
`;

export const Main = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-area: 2;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  border: 3px solid black;
  border-bottom: none;
  box-sizing: border-box;
  object-fit: cover;
`;

export const Buttons = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

  a {
    width: 100%;
    display: inline-block;
    border: 3px solid black;
    padding: 10px 0;
    outline: none;
    font-family: "Poppins", sans-serif;
    font-size: 1.1rem;
    transition: 0.5s all;
    background-color: #f6f7f9;
    text-align: center;
    box-sizing: border-box;

    :hover {
      background-color: black;
      color: #f6f7f9;
    }
  }

  a:nth-of-type(1) {
    border-right: none;
  }
`;

export const Details = styled.div`
  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 1fr auto;
  }
`;

export const Title = styled.h2`
  font-weight: bold;
  font-size: 1.6rem;
  margin: 10px 0;
`;

export const Text = styled.p`
  font-weight: 300;
  width: 100%;
  margin-bottom: 15px;
  font-size: 1.2rem;
`;

export const Icons = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid gray;
  padding: 10px 0;
  position: relative;

  svg {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    cursor: pointer;
  }

  @media (min-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(7, 1fr);
    border: none;

    svg {
      margin: 0 40px;
    }
  }
`;

export const IconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  :hover {
    span {
      opacity: 1;
    }
  }

  span {
    display: inline-block;
    background-color: #e7e7e7;
    border-radius: 10px;
    text-align: center;
    font-size: 0.9rem;
    position: absolute;
    right: 0;
    padding: 5px;
    opacity: 0;
    transition: 0.3s all ease-in-out;
    width: 80%;
  }
`;

export const ImgContainer = styled.div`
  cursor: pointer;
  position: relative;
  overflow: hidden;

  :hover {
    img {
      top: 0;
      opacity: 1;
    }
  }
`;

export const SecondImg = styled.img`
  position: absolute;
  opacity: 0;
  transition: 0.4s all ease-in-out;
  width: 100%;
  height: 100%;
  border: 3px solid black;
  border-bottom: none;
  box-sizing: border-box;
  bottom: 0;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1;
`;
