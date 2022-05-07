import React, { useContext, useEffect, useState } from "react";
import Contacts from "../contacts/Contacts";
import ContactForm from "../contacts/ContactForm";
import ContactFilter from "../contacts/ContactFilter";
import AuthContext from "../../context/auth/authContext";

const Home = () => {
  const authContext = useContext(AuthContext);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    authContext.loadUser();
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="tab-group">
        <button className="tab-button" onClick={() => setTab(0)}>
          Contact Form
        </button>
        <button className="tab-button" onClick={() => setTab(1)}>
          Contacts
        </button>
      </div>
      <div className="grid-2">
        {tab === 0 ? (
          <div>
            <ContactForm />
          </div>
        ) : (
          <div>
            <ContactFilter />
            <Contacts />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
